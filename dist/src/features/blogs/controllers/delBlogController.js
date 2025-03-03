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
exports.delBlogController = void 0;
const db_1 = require("../../../db/db");
const blogsRepository_1 = require("../blogsRepository");
const delBlogController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Извлекаем ID блога
    const blogFind = yield blogsRepository_1.blogsRepository.find(id); // Ищем блог по ID
    if (!blogFind) {
        res.status(db_1.HTTP_STATUSES.NOT_FOUND_404).send({ error: "Blog not found" }); // Если блог не найден
    }
    else {
        yield blogsRepository_1.blogsRepository.del(id); // Удаляем блог и получаем удаленный объект
        res
            .sendStatus(db_1.HTTP_STATUSES.NO_CONTENT_204); // Возвращаем статус 204
    }
});
exports.delBlogController = delBlogController;
