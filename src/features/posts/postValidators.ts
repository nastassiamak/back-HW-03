import {body} from "express-validator";
import {NextFunction, Request, Response} from "express";
import {blogsRepository} from "../blogs/blogsRepository";
import {postsRepository} from "./postsRepository";
import {HTTP_STATUSES} from "../../db/db";
import {adminMiddleware} from "../../global_middlewares/admin-middleware";
import {inputCheckErrorsMiddleware} from "../../global_middlewares/inputCheckErrorsMiddleware";
import {BlogBbType} from "../../db/blog-db-type";

// title: string // max 30
// shortDescription: string // max 100
// content: string // max 1000
// blogId: string // valid

export const titleValidator = body("title").isString().withMessage('not string')
    .trim().isLength({min: 1, max: 30}).withMessage('more then 30 or 0')

export const shortDescriptionValidator = body("shortDescription").isString().withMessage('not string')
    .trim().isLength({min: 1, max: 100}).withMessage('more then 100 or 0')

export const contentValidator = body("content").isString().withMessage('not string')
    .trim().isLength({min: 1, max: 1000}).withMessage('more then 1000 or 0')

export const createdAtValidator = body('createdAt')
    .optional() // Делает поле необязательным
    .isString()
    .withMessage('not string')
    .trim()
    .matches(/^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(\.\d+)?([+-][0-2]\d:[0-5]\d|Z)$/)
    .withMessage('not valid date format');


export const blogIdValidator = body("blogId").isString().withMessage('not string')
    .trim()
    .custom(async (blogId: string) => {
        const blog = await blogsRepository.find(blogId);
        if (!blog) {
            throw new Error('no blog'); // Явно сообщите об ошибке, если блог не найден
        }
        return true; // Если блог найден
    });

export const findPostValidator = async (req: Request<{id: string}>,
                                  res: Response, next: NextFunction) => {
    const postId = req.params.id;
    const post = await postsRepository.find(postId);
    if (!post) {
        res
            .status(HTTP_STATUSES.NOT_FOUND_404)
            .json({});
        return
    }

    next()
}

export const postValidators = [
    adminMiddleware,

    titleValidator,
    shortDescriptionValidator,
    contentValidator,
    blogIdValidator,
    createdAtValidator,

    inputCheckErrorsMiddleware


]