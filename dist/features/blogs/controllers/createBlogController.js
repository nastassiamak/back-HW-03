"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBlogController = void 0;
const db_1 = require("../../../db/db");
const blogsRepository_1 = require("../blogsRepository");
const createBlogController = (req, res) => {
    const newBlogId = blogsRepository_1.blogsRepository.create(req.body);
    const newBlog = blogsRepository_1.blogsRepository.findAndMap(newBlogId);
    res
        .status(db_1.HTTP_STATUSES.CREATED_201)
        .json(newBlog);
};
exports.createBlogController = createBlogController;
