"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.putPostController = void 0;
const postsRepository_1 = require("../postsRepository");
const db_1 = require("../../../db/db");
const putPostController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const existingPost = yield postsRepository_1.postsRepository.find(id); // Ищем пост по ID
    if (!existingPost) {
        res.status(db_1.HTTP_STATUSES.NOT_FOUND_404).send("Post not found"); // Возвращаем ошибку если пост не найден
    }
    const updatedPost = yield postsRepository_1.postsRepository.put(req.body, id);
    if (updatedPost === null) {
        res.status(db_1.HTTP_STATUSES.BAD_REQUEST_400).send("Failed to update post"); // Возвращаем ошибку если обновление не удалось
    }
    else {
        res.sendStatus(db_1.HTTP_STATUSES.NO_CONTENT_204); // Отправляем ответ 204
    }
});
exports.putPostController = putPostController;
