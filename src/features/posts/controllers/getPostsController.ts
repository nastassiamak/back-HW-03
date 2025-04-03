import { Request, Response } from 'express'
import {postsRepository} from "../postsRepository";
import {HTTP_STATUSES} from "../../../db/db";
import {PostViewModel} from "../../../input-output-type/post_type";
import {blogsRepository} from "../../blogs/blogsRepository";

export const getPostsController = async (req: Request,
                                         res: Response<PostViewModel[]>) => {
    const posts = await postsRepository.getAll()// получаем базы данных
    if (!posts) {
        res.status(HTTP_STATUSES.NOT_FOUND_404)
    } else {
        res
            .status(HTTP_STATUSES.OK_200)
            .json(posts) // отдаём видео в качестве ответа
    }
}
