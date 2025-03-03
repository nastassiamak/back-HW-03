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
exports.delPostController = void 0;
const postsRepository_1 = require("../postsRepository");
const db_1 = require("../../../db/db");
const delPostController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const postFind = yield postsRepository_1.postsRepository.find(id);
    if (!postFind) {
        res.status(db_1.HTTP_STATUSES.NOT_FOUND_404).send({ error: "Post not found" });
    }
    const postId = yield postsRepository_1.postsRepository.del(id);
    if (postId) {
        res
            .sendStatus(db_1.HTTP_STATUSES.NO_CONTENT_204);
    }
});
exports.delPostController = delPostController;
