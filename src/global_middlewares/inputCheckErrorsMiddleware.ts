import {Request, Response} from 'express';
import {FieldNamesType, OutputErrorsType} from "../input-output-type/error_type";
import {NextFunction} from "express";
import {validationResult} from "express-validator";
import {HTTP_STATUSES} from "../db/db";

export const inputCheckErrorsMiddleware = (req: Request,
                                           res: Response<OutputErrorsType>, next: NextFunction) => {
    const e = validationResult(req)
    if (!e.isEmpty()) {
        const eArray = e.array({onlyFirstError: true}) as { path: FieldNamesType, msg: string }[]

        res
            .status(HTTP_STATUSES.BAD_REQUEST_400)
            .json({
                errorsMessages: eArray.map(x => ({field: x.path, message: x.msg}))
            })
        return
    }

    next()
}