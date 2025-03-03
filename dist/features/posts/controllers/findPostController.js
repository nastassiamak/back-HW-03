"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPostController = void 0;
const postsRepository_1 = require("../postsRepository");
const db_1 = require("../../../db/db");
const findPostController = (req, res) => {
    const { id } = req.params;
    const post = postsRepository_1.postsRepository.find(id);
    if (!post) {
        res
            .sendStatus(db_1.HTTP_STATUSES.NOT_FOUND_404);
    }
    res
        .status(db_1.HTTP_STATUSES.OK_200).send(post);
};
exports.findPostController = findPostController;
