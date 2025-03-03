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
exports.putBlogController = void 0;
const db_1 = require("../../../db/db");
const blogsRepository_1 = require("../blogsRepository");
const putBlogController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Извлекаем ID блога из параметров
    const blog = yield blogsRepository_1.blogsRepository.find(id); // Ищем блог по ID
    // Если блог не найден, возвращаем статус 404
    if (!blog) {
        res.sendStatus(db_1.HTTP_STATUSES.NOT_FOUND_404); // Завершаем выполнение функции
    }
    else {
        // Попытка обновления блога
        const updatedBlog = yield blogsRepository_1.blogsRepository.put(req.body, id);
        // Проверяем, если обновление прошло успешно
        if (!updatedBlog) {
            console.log("Failed to update post:", req.body);
            res.sendStatus(db_1.HTTP_STATUSES.BAD_REQUEST_400); // Возвращаем статус 400 при ошибке обновления
        }
        else {
            // Если обновление прошло успешно, возвращаем статус 204 (нет содержимого)
            res.sendStatus(db_1.HTTP_STATUSES.NO_CONTENT_204);
        }
    }
});
exports.putBlogController = putBlogController;
