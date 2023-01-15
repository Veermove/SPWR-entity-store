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
import { createComment, getComments, handleCommentLikeChange } from "../actions/comments";
import { getPostsPagin, handlePostLikeChange } from "../actions/postAccess";
import { getNextPostToModerate, moderatePostDecide } from "../actions/moderate";




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
    app.put(`${apiV1}/post/pagin`, getPostsPagin);

    // get next post to moderate
    app.post(`${apiV1}/post/moderate/next`, getNextPostToModerate);

    // decide if post is viable for viewing
    app.post(`${apiV1}/post/moderate/:postId/decide`, moderatePostDecide);

    // get all posts by user

    // like a post
    app.post(`${apiV1}/post/like`, handlePostLikeChange);

    // vote in poll
    app.put(`${apiV1}/post/poll/vote`, voteInPoll);

    // create a comment
    app.post(`${apiV1}/comments/create`, createComment);

    // like a comment
    app.post(`${apiV1}/comments/like`, handleCommentLikeChange);

    // get all comments for posts
    app.put(`${apiV1}/comments`, getComments);


}
