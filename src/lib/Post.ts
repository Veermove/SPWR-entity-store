import { Timestamp } from "firebase/firestore";

export interface Post {
    id: string,
    author: string,
    creationDate: Timestamp,

    content: string,
    isPoll: boolean,
    pollOptions?: {
        option: string,
        votes: number,
    }[],
    tags: string[],
    likes: number,
}

export interface CommentsAggregate {
    postId: string,
    comments: {
        value: string,
        likes: number,
        author: string,
        creationDate: Timestamp,
    }[];
}
