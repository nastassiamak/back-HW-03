//Функция вывода
import {Request, Response} from "express";
import {HTTP_STATUSES} from "../../../db/db";
import {BlogViewModel} from "../../../input-output-type/blog_type";
import {blogsRepository} from "../blogsRepository";

export const getBlogsController = async (req: Request,
                                   res: Response<BlogViewModel[]>) => {
    const blogs =  await blogsRepository.getAll()// получаем базы данных

    res
        .status(HTTP_STATUSES.OK_200)
        .json(blogs) // отдаём видео в качестве ответа
}
