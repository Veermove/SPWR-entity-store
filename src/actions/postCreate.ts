import type { RequestHandler } from "express";
import type { Post } from "../lib/Post";
import { Timestamp, doc, setDoc } from "firebase/firestore";
import { useMemory } from "..";
import { v4 as uuidv4} from "uuid";
import { isMessageSpam } from "../lib/Spam";

export const createPostVerified: RequestHandler = async (req, res, next) => {
    const { author, content, isPoll, pollOptions, tags } = req.body;
    const { db } = useMemory();

    if (
        content === null
        || isPoll === null
        || content === ""
    ) {
        res.status(400).send({err: "author, content or isPoll is missing"});
        return next();
    }

    const shouldMessageBeHidden = isMessageSpam(content, tags, pollOptions) || !author ;

    const
        post: Post = {
            id: uuidv4(),
            creationDate: Timestamp.now(),
            author: author,
            content: content,
            isPoll: isPoll,
            pollOptions: pollOptions,
            tags: tags,
            likes: 0,
            isHidden: shouldMessageBeHidden,
        },
        postRef = doc(db, "posts", post.id);

    try {

        await setDoc(postRef, post);
        // await setDoc(commentsRef, comments);

        res.status(200).send({ post });
    } catch (e) {
        res.status(500).send({err: `Creation failed: ${e}`});
    }

    return next();
};
