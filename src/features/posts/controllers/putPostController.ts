import {Request, Response} from "express";
import {postsRepository} from "../postsRepository";
import {HTTP_STATUSES} from "../../../db/db";
import {PostInputModel} from "../../../input-output-type/post_type";
export const putPostController = async (req: Request<{ id: string }, {}, PostInputModel>, res: Response) => {
    const { id } = req.params;
    const existingPost = await postsRepository.find(id); // Ищем пост по ID

    if (!existingPost) {
        res.status(HTTP_STATUSES.NOT_FOUND_404).send("Post not found"); // Возвращаем ошибку если пост не найден
    }

    const updatedPost  = await postsRepository.put(req.body, id);

    if (updatedPost === null) {
        res.status(HTTP_STATUSES.BAD_REQUEST_400).send("Failed to update post"); // Возвращаем ошибку если обновление не удалось
    } else {

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204); // Отправляем ответ 204

    }
};