import {body} from "express-validator";
import {Request, Response} from "express";
import {NextFunction} from "express";
import {adminMiddleware} from "../../global_middlewares/admin-middleware";
import {HTTP_STATUSES} from "../../db/db";
import {inputCheckErrorsMiddleware} from "../../global_middlewares/inputCheckErrorsMiddleware";

// name: string // max 15
// description: string // max 500
// websiteUrl: string // max 100 ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$

export const nameValidator = body('name')
    .isString().withMessage('not string')
    .trim().isLength({min: 1, max: 15})
    .withMessage('more then 15 or 0');

export const descriptionValidator = body('description')
    .isString().withMessage('not string')
    .trim().isLength({min: 1, max: 500})
    .withMessage('more then 500 or 0');

export const websiteUrlValidator = body('websiteUrl')
    .isString().withMessage('not string')
    .trim().isURL().withMessage('not url')
    .isLength({min: 1, max: 100}).withMessage('more then 100 or 0');
/*
export const createdAtValidator = body('createdAt')
    .isString()
    .withMessage('not string')
    .trim()
    .matches(/^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(\.\d+)?([+-][0-2]\d:[0-5]\d|Z)$/)
    .withMessage('not valid date format');
*/
export const isMembershipValidator = body('isMembership')
    .isBoolean().withMessage('must be a boolean')
    .toBoolean(); // Опционально, чтобы преобразовать входное значение в булевый тип

export const findBlogValidator = async (req: Request<{id: string}>,
                                  res: Response, next: NextFunction) => {
    const {id} = req.params;
    if (typeof id !== "string" || id.trim().length === 0) {
         res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400);
    }
    next()
}

export const blogValidators = [
    adminMiddleware,

    nameValidator,
    descriptionValidator,
    websiteUrlValidator,
    //createdAtValidator,
    isMembershipValidator,

    inputCheckErrorsMiddleware,
]