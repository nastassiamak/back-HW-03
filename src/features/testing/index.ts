import {Router} from "express";
import {HTTP_STATUSES, setDB} from "../../db/db";

export const testingRouter = Router();

testingRouter.delete('/all-data', (req, res) => {
    setDB()
    res.status(HTTP_STATUSES.NO_CONTENT_204).json({})
})