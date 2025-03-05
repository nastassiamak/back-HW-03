import {Router} from "express";
import {HTTP_STATUSES} from "../../db/db";
import {clearDb} from "../../db/mongoDb";

export const testingRouter = Router();

testingRouter.delete('/all-data', async (req,
                                         res) => {
    console.log("Запрос поступил на /all-data");
    await clearDb();
    console.log("База данных очищена");
    res.status(HTTP_STATUSES.NO_CONTENT_204).json({});

})