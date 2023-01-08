import { RequestHandler } from "express";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import type { Post } from "../lib/Post";
import { useMemory } from "..";

export const voteInPoll: RequestHandler = async (req, res, next) => {
    const
        { postId, options } = req.body,
        { db } = useMemory(),
        postRef = doc(db, "posts", postId);
    try {
        const
            post = (await getDoc(postRef)).data()! as Post,
            pollOpts = post.pollOptions!;

        const updatedPollOpts = pollOpts.map(({option, votes}) => {
            if ((options as string[]).includes(option)) {
                return {option, votes: votes + 1};
            }
            return {option, votes};
        });

        await updateDoc(postRef, { pollOptions: updatedPollOpts});
        res.status(200).send({ pollOptions: updatedPollOpts });
        return next();
    } catch (e) {
        res.status(400).send({ err: e});
        return next();
    }

};
