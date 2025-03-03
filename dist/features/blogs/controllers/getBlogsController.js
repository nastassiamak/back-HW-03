"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlogsController = void 0;
const db_1 = require("../../../db/db");
const blogsRepository_1 = require("../blogsRepository");
const getBlogsController = (req, res) => {
    const blogs = blogsRepository_1.blogsRepository.getAll(); // получаем базы данных
    res
        .status(db_1.HTTP_STATUSES.OK_200)
        .json(blogs); // отдаём видео в качестве ответа
};
exports.getBlogsController = getBlogsController;
