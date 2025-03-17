// Функция обновления
import {Request, Response} from "express";
import {HTTP_STATUSES} from "../../../db/db";
import {BlogInputModel} from "../../../input-output-type/blog_type";
import {blogsRepository} from "../blogsRepository";
import {PostInputModel} from "../../../input-output-type/post_type";
import {postsRepository} from "../../posts/postsRepository";
import {blogsCollection} from "../../../db/mongoDb";
import {ObjectId} from "mongodb";



export const putBlogController = async (req: Request<{ id: string }, {}, BlogInputModel>,
                                  res: Response) => {

    const {id} = req.params; // Извлекаем ID блога из параметров
    const blog = await blogsRepository.find(id); // Ищем блог по ID

    // Если блог не найден, возвращаем статус 404
    if (!blog) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404); // Завершаем выполнение функции
    } else {

        // Попытка обновления блога
        const updatedBlog = await blogsRepository.put(req.body, id);

        // Проверяем, если обновление прошло успешно
        if (!updatedBlog) {
            console.log("Failed to update post:", req.body);
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400); // Возвращаем статус 400 при ошибке обновления
        } else {

            // Если обновление прошло успешно, возвращаем статус 204 (нет содержимого)
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
        }
    }
}