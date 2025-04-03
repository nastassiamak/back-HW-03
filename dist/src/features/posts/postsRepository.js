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
exports.postsRepository = {
    create(post) {
        return __awaiter(this, void 0, void 0, function* () {
            // Сначала находим блог, чтобы получить его название
            const blog = yield blogsRepository_1.blogsRepository.find(post.blogId);
            const blogName = blog ? blog.name : "Неизвестный блог"; // Устанавливаем имя блога
            // Создаем новый пост с необходимыми полями
            const newPost = {
                id: new Date().toISOString() + Math.random().toString(), // Генерация уникального идентификатора
                title: post.title,
                content: post.content,
                shortDescription: post.shortDescription,
                blogId: post.blogId,
                blogName: blogName, // Здесь сохраняем название блога
                createdAt: new Date().toISOString(), // Сохраняем текущую дату в правильном формате
            };
            // Пытаемся вставить новый пост в коллекцию
            try {
                const res = yield mongoDb_1.postsCollection.insertOne(newPost); // Вставка в коллекцию
                const createdPost = {
                    id: newPost.id,
                    title: newPost.title,
                    content: newPost.content,
                    shortDescription: newPost.shortDescription,
                    blogId: newPost.blogId,
                    blogName: newPost.blogName,
                    createdAt: newPost.createdAt, // Сохраняем дату создания
                };
                return createdPost; // Возвращаем созданный пост
            }
            catch (error) {
                console.error('Error inserting new post:', error);
                throw new Error('Failed to create post'); // Обработка ошибок
            }
        });
    },
    find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield mongoDb_1.postsCollection.findOne({ id: id }, { projection: { _id: 0 } });
            return post ? Object.assign(Object.assign({}, post), { id: post.id }) : null;
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
            const posts = yield mongoDb_1.postsCollection.find({}, { projection: { _id: 0 } }).toArray();
            return posts.map(post => (Object.assign(Object.assign({}, post), { id: post.id })));
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
            const blog = yield blogsRepository_1.blogsRepository.find(post.blogId);
            if (!blog) {
                return null;
            }
            const result = yield mongoDb_1.postsCollection.updateOne({ id: id }, { $set: post });
            return result.modifiedCount ? { id } : null;
        });
    },
    map(post) {
        return {
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
        };
    },
};
