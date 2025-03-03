"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delPostController = void 0;
const postsRepository_1 = require("../postsRepository");
const db_1 = require("../../../db/db");
const delPostController = (req, res) => {
    const { id } = req.params; // Извлекаем ID блога
    const postFind = postsRepository_1.postsRepository.find(id); // Ищем блог по ID
    if (!postFind) {
        res.status(db_1.HTTP_STATUSES.NOT_FOUND_404).send({ error: "Blog not found" }); // Если блог не найден
    }
    postsRepository_1.postsRepository.del(id); // Удаляем блог и получаем удаленный объект
    res
        .sendStatus(db_1.HTTP_STATUSES.NO_CONTENT_204); // Возвращаем статус 204
};
exports.delPostController = delPostController;
