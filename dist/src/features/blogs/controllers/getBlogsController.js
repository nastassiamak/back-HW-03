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
exports.getBlogsController = void 0;
const db_1 = require("../../../db/db");
const blogsRepository_1 = require("../blogsRepository");
const getBlogsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogs = yield blogsRepository_1.blogsRepository.getAll(); // получаем базы данных
    if (!blogs) {
        res.status(db_1.HTTP_STATUSES.NOT_FOUND_404);
    }
    else {
        res
            .status(db_1.HTTP_STATUSES.OK_200)
            .json(blogs); // отдаём видео в качестве ответа
    }
});
exports.getBlogsController = getBlogsController;
