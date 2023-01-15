import { RequestHandler } from "express";
import { collection, deleteDoc, doc, getDoc, getDocs, limit, query, setDoc, where } from "firebase/firestore";
import { useMemory } from "..";
import { Post } from "../lib/Post";

export const getNextPostToModerate: RequestHandler = async (req, res, next) => {
    const
        { db } = useMemory(),
        { email } = req.body,
        userRef = doc(db, "users", email);

    try {
        const user = await getDoc(userRef);
        if (!user.exists()) {

            res.status(400).send({msg: `Failed to find user with email: ${email}`});
            return next();
        }

        const { role } = user.data();
        if ((role as number) !== 1) {
            res.status(401).send({msg: "Only moderators have access to this endpoint"});
        }


        const clauses = [];
        clauses.push(where("isHidden", "==", true));

        const postQuery =
            query(collection(db, "posts"), ...clauses, limit(1));

        const result = await getDocs(postQuery);
        const posts = result.docs.map((doc) => doc.data() as Post);
        if (posts.length >= 1) {
            res.status(200).send({ post: posts[0] });
        } else {
            res.status(202).send({});
        }
        return next();
    } catch (e) {
        res.status(400).send({ err: e });
        return next();
    }

};


export const moderatePostDecide: RequestHandler = async (req, res, next) => {
    const
        { db } = useMemory(),
        { email, accepted } = req.body,
        postId = req.params.postId,
        userRef = doc(db, "users", email),
        postRef = doc(db, "posts", postId);

    try {
        const user = await getDoc(userRef);
        if (!user.exists()) {

            res.status(400).send({err: `Failed to find user with email: ${email}`});
            return next();
        }

        const { role } = user.data();
        if ((role as number) !== 1) {
            res.status(401).send({err: "Only moderators have access to this endpoint"});
        }

        if (accepted) {
            await setDoc(postRef, { isHidden: false }, { merge: true });
        } else {
            await deleteDoc(postRef);
        }
        res.status(200).send({});

    } catch (e) {
        res.status(400).send({ err: e });
        return next();
    }
};
