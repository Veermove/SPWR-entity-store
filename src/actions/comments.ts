import { RequestHandler } from "express";
import { doc, getDoc } from "firebase/firestore";
import { useMemory } from "..";
import { CommentsAggregate } from "../lib/Post";

export const getComments: RequestHandler = async (req, res, next) => {
    const
        { db, logger } = useMemory(),
        postId = req.params.postId,
        commentsRef = doc(db, "comms", postId);

    logger.info(postId);
    try {
        const comments = await getDoc(commentsRef);

        if (!comments.exists()) {
            res.status(202).send();
            return next();
        }

        const comentsAgg = comments.data() as CommentsAggregate;

        res.status(200).send({commentsAgregation: comentsAgg});
        return next();
    } catch (e) {
        res.status(500).send({ err: e });
        return next;
    }
};
