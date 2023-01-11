import { RequestHandler } from "express";
import { doc, getDoc, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { useMemory } from "..";
import { CommentsAggregate } from "../lib/Post";
import { splitArray } from "../lib/utils";

export const getComments: RequestHandler = async (req, res, next) => {
    const
        { db } = useMemory(),
        postId = req.body.postId,
        commentsRef = doc(db, "comms", postId);

    try {
        const comments = await getDoc(commentsRef);

        if (!comments.exists()) {
            res.status(202).send();
            return next();
        }

        const comentsAgg = comments.data() as CommentsAggregate;

        res.status(200).send({commentsAgregation: comentsAgg});

    } catch (e) {
        res.status(500).send({ err: e });
    }
    return next();
};

export const createComment: RequestHandler = async (req, res, next) => {
    const
        { db } = useMemory(),
        { postId, author, comment} = req.body,
        commentsRef = doc(db, "comms", postId as string);

    try {
        const commentObj = {
            value: comment,
            likes: 0,
            author,
            creationDate: Timestamp.now(),
        };
        const comments = await getDoc(commentsRef);

        if (!comments.exists()) {
            const createComments = {
                postId,
                comments: [commentObj],
            };
            await setDoc(commentsRef, createComments);
        } else {
            const currentComments = comments.data() as CommentsAggregate;
            await updateDoc(
                commentsRef,
                { comments: [
                    ...currentComments.comments,
                    commentObj,
                ]},
            );

        }

        res.status(200).send({});
        return next();
    } catch (e) {
        res.status(500).send({ err: e });
        return next();
    }
};

export const handleCommentLikeChange: RequestHandler = async (req, res, next) => {
    const
        { db } = useMemory(),
        { postId, author, timestamp, likedOrUnliked } = req.body,
        commentsRef = doc(db, "comms", postId);

    try {
        const comments = await getDoc(commentsRef);

        if (!comments.exists()) {
            res.status(404).send();
        }

        const comentsAgg = comments.data() as CommentsAggregate;
        const [likedComments, otherComments] = splitArray(
            comentsAgg.comments,
            (comm) => comm.author === author && comm.creationDate.seconds === timestamp,
        );

        if (likedComments.length > 1) { throw Error("Found multiple comments that matched the predicate"); }

        const likedComment = likedComments[0];
        if (likedOrUnliked) { // like pressed case
            likedComment.likes += 1;
        } else { // un-like / like redacted
            likedComment.likes -= 1;
        }


        await updateDoc(
            commentsRef,
            { comments: [
                ...otherComments,
                likedComment,
            ]},
        );

        res.status(200).send({ newLikes: likedComment.likes });
    } catch (e) {
        res.status(500).send({ err: e });

    }
    return next();

};

