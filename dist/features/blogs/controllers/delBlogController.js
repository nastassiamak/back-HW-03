"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delBlogController = void 0;
const db_1 = require("../../../db/db");
const blogsRepository_1 = require("../blogsRepository");
const delBlogController = (req, res) => {
    const { id } = req.params; // Извлекаем ID блога
    const blogFind = blogsRepository_1.blogsRepository.find(id); // Ищем блог по ID
    if (!blogFind) {
        res.status(db_1.HTTP_STATUSES.NOT_FOUND_404).send({ error: "Blog not found" }); // Если блог не найден
    }
    blogsRepository_1.blogsRepository.del(id); // Удаляем блог и получаем удаленный объект
    res
        .sendStatus(db_1.HTTP_STATUSES.NO_CONTENT_204); // Возвращаем статус 204
};
exports.delBlogController = delBlogController;
