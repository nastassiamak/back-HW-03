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
exports.postsRepository = void 0;
const blogsRepository_1 = require("../blogs/blogsRepository");
const mongoDb_1 = require("../../db/mongoDb");
const mongodb_1 = require("mongodb");
exports.postsRepository = {
    create(post) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield blogsRepository_1.blogsRepository.find(post.blogId.toString());
            const blogName = blog ? blog.name : "Неизвестный блог"; // Поверяем и устанавливаем значение по умолчанию
            const newPost = {
                id: new mongodb_1.ObjectId().toString(),
                title: post.title,
                content: post.content,
                shortDescription: post.shortDescription,
                blogId: post.blogId,
                blogName: blogName,
                createdAt: new Date().toISOString(),
            };
            const res = yield mongoDb_1.postsCollection.insertOne(newPost);
            return newPost;
            // db.posts = [...db.posts, newPost]
            // return newPost.id
        });
    },
    find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield mongoDb_1.postsCollection.findOne({ id });
        });
    },
    findByUUID(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield mongoDb_1.postsCollection.findOne({ _id });
        });
    },
    findAndMap(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield this.find(id); // использовать этот метод если проверили существование
            return post ? this.map(post) : undefined;
        });
    },
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield mongoDb_1.postsCollection.find({}).toArray();
        });
    },
    del(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongoDb_1.postsCollection.deleteOne({ id });
            return result.deletedCount ? { id } : null;
        });
    },
    put(post, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield blogsRepository_1.blogsRepository.find(post.blogId.toString());
            if (!blog) {
                return null;
            }
            const result = yield mongoDb_1.postsCollection.updateOne({ id }, { $set: post });
            return result.modifiedCount ? { id } : null;
        });
    },
    map(post) {
        const postForOutput = {
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
        };
        return postForOutput;
    },
};
