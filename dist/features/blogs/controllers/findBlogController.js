"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findBlogController = void 0;
const db_1 = require("../../../db/db");
const blogsRepository_1 = require("../blogsRepository");
const findBlogController = (req, res) => {
    const { id } = req.params;
    const blog = blogsRepository_1.blogsRepository.find(id);
    if (!blog) {
        res
            .sendStatus(db_1.HTTP_STATUSES.NOT_FOUND_404);
    }
    res.status(db_1.HTTP_STATUSES.OK_200).send(blog);
};
exports.findBlogController = findBlogController;
