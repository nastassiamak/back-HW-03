// Функция удаления
import {Request, Response} from "express";
import {db, HTTP_STATUSES} from "../../../db/db";
import {blogsRepository} from "../blogsRepository";
import {postsRepository} from "../../posts/postsRepository";
import {ObjectId} from "mongodb";

export const delBlogController = async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params; // Извлекаем ID блога

    const blogFind = await blogsRepository.find(id); // Ищем блог по ID
    if (!blogFind) {
        res.status(HTTP_STATUSES.NOT_FOUND_404).send({ error: "Blog not found" }); // Если блог не найден
    } else {

        await blogsRepository.del(id); // Удаляем блог и получаем удаленный объект
        res
            .sendStatus(HTTP_STATUSES.NO_CONTENT_204); // Возвращаем статус 204
    }};