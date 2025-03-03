"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostsController = void 0;
const postsRepository_1 = require("../postsRepository");
const db_1 = require("../../../db/db");
const getPostsController = (req, res) => {
    const posts = postsRepository_1.postsRepository.getAll();
    res
        .status(db_1.HTTP_STATUSES.OK_200)
        .json(posts);
};
exports.getPostsController = getPostsController;
