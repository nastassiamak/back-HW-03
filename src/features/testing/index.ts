import {Router} from "express";
import {HTTP_STATUSES, setDB} from "../../db/db";
import {clearDb} from "../../db/mongoDb";

export const testingRouter = Router();

testingRouter.delete('/all-data', async (req,
                                         res) => {
    setDB()
    res.status(HTTP_STATUSES.NO_CONTENT_204).json({});

})