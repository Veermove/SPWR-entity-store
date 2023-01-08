/**
 * Routes configuration.
 *
 * @module pwrspotted-app
 * @license BSD-2-Clause
 * @copyright Mat. 2020
 */




import { useMemory } from "../index";
import { apiV1 } from "./env";

import { hello } from "../actions/hello";
import { createPostVerified } from "../actions/postCreate";
import { voteInPoll } from "../actions/poll";
import { getComments } from "../actions/comments";




/**
 * Routes configuration.
 */
export default function configureRoutes (): void {

    const { app } = useMemory();

    // "hello world" route
    app.get(`${apiV1}/`, hello);


    // create post
    app.post(`${apiV1}/post/create/verified`, createPostVerified);

    // get all posts

    // get all posts by user

    // like a post

    // vote in poll
    app.put(`${apiV1}/post/poll/vote`, voteInPoll);

    // create a comment

    // like a comment

    // get all comments for posts
    app.get(`${apiV1}/coments/:postId`, getComments);


}
