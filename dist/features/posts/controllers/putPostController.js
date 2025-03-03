"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.putPostController = void 0;
const postsRepository_1 = require("../postsRepository");
const db_1 = require("../../../db/db");
const putPostController = (req, res) => {
    const { id } = req.params;
    const post = postsRepository_1.postsRepository.find(id);
    if (!post) {
        res
            .sendStatus(db_1.HTTP_STATUSES.NOT_FOUND_404);
    }
    const updatedPost = postsRepository_1.postsRepository.put(req.body, id);
    // Проверяем, если обновление прошло успешно
    if (!updatedPost) {
        res.sendStatus(db_1.HTTP_STATUSES.BAD_REQUEST_400); // Возвращаем статус 400 при ошибке обновления
    }
    // Если обновление прошло успешно, возвращаем статус 204 (нет содержимого)
    res.sendStatus(db_1.HTTP_STATUSES.NO_CONTENT_204);
};
exports.putPostController = putPostController;
