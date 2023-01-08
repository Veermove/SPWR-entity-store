import { RequestHandler } from "express";
import { collection, getDocs, limit, orderBy, query, startAfter } from "firebase/firestore";
import { useMemory } from "..";
import { Post } from "../lib/Post";

export const getPostsPagin: RequestHandler = async (req, res, _next) => {

    const { db } = useMemory();
    const { lastPost } = req.body;

    const postQuery = lastPost
        ? query(collection(db, "posts"), orderBy("likes"), startAfter(lastPost), limit(25))
        : query(collection(db, "posts"), orderBy("likes"), limit(25));

    try {
        const result = await getDocs(postQuery);
        const posts = result.docs.map((doc) => doc.data() as Post);

        res.status(200).send({ posts });
    } catch (e) {
        res.status(400).send({ err: e});
    }
};
