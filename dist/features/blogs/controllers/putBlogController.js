"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.putBlogController = void 0;
const db_1 = require("../../../db/db");
const blogsRepository_1 = require("../blogsRepository");
const putBlogController = (req, res) => {
    const { id } = req.params; // Извлекаем ID блога из параметров
    const blog = blogsRepository_1.blogsRepository.find(id); // Ищем блог по ID
    // Если блог не найден, возвращаем статус 404
    if (!blog) {
        res.sendStatus(db_1.HTTP_STATUSES.NOT_FOUND_404); // Завершаем выполнение функции
    }
    // Попытка обновления блога
    const updatedBlog = blogsRepository_1.blogsRepository.put(req.body, id);
    // Проверяем, если обновление прошло успешно
    if (!updatedBlog) {
        res.sendStatus(db_1.HTTP_STATUSES.BAD_REQUEST_400); // Возвращаем статус 400 при ошибке обновления
    }
    // Если обновление прошло успешно, возвращаем статус 204 (нет содержимого)
    res.sendStatus(db_1.HTTP_STATUSES.NO_CONTENT_204);
};
exports.putBlogController = putBlogController;
