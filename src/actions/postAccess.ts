import { RequestHandler } from "express";
import { collection, doc, getDoc, getDocs, limit, query, startAfter, updateDoc, where } from "firebase/firestore";
import { useMemory } from "..";
import { Post } from "../lib/Post";

export const getPostsPagin: RequestHandler = async (req, res, next) => {

    const { db } = useMemory();
    const
        lastPostId: string  = req.body.lastPostId,
        queryTags: string[] = req.body.queryTags;

    try {


        const clauses = [];
        if (queryTags) {
            clauses.push(where("tags", "array-contains-any", queryTags));
        }
        if (lastPostId) {
            clauses.push(startAfter(await getDoc(doc(db, "posts", lastPostId))));
        }

        clauses.push(where("isHidden", "==", false));

        const postQuery =
            query(collection(db, "posts"), ...clauses, limit(25));

        const result = await getDocs(postQuery);
        const posts = result.docs.map((doc) => doc.data() as Post);

        res.status(200).send({ posts });
        return next();
    } catch (e) {
        res.status(400).send({ err: e });
        return next();
    }
};


export const handlePostLikeChange: RequestHandler = async (req, res, next) => {
    const
        { db } = useMemory(),
        { postId, likedOrUnliked } = req.body,
        documentRef = doc(db, "posts", postId);

    try {
        const postData = await getDoc(documentRef);

        if (!postData.exists()) {
            res.status(404).send();
        }

        const post = postData.data() as Post;

        if (likedOrUnliked) { // like pressed case
            post.likes += 1;
        } else { // un-like / like redacted
            post.likes -= 1;
        }

        await updateDoc(
            documentRef,
            { likes: post.likes},
        );

        res.status(200).send({ newLikes: post.likes });
    } catch (e) {
        res.status(500).send({ err: e });

    }
    return next();

};
