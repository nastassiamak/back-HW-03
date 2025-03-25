import {Router} from "express";

import {HTTP_STATUSES} from "../../db/db";
import {blogsCollection, postsCollection} from "../../db/mongoDb";

export const testingRouter = Router();

testingRouter.delete('/all-data', async (req,
                                         res) => {
    await blogsCollection.deleteMany({});
    await postsCollection.deleteMany({});
    res.status(HTTP_STATUSES.NO_CONTENT_204).json({})

})