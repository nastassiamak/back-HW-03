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
exports.blogsRepository = void 0;
const mongoDb_1 = require("../../db/mongoDb"); // Подключите к своей коллекции
exports.blogsRepository = {
    create(blog) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoDb_1.blogsCollection) {
                throw new Error("blogsCollection не инициализирована.");
            }
            // Создаем объект нового блога без id
            const newBlog = {
                id: new Date().toISOString() + Math.random().toString(),
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl,
                createdAt: new Date().toISOString(), // Генерация текущего времени
                isMembership: false // Используем значение из blog или false по умолчанию
            };
            try {
                const result = yield mongoDb_1.blogsCollection.insertOne(newBlog);
                return newBlog;
            }
            catch (error) {
                console.error('Error inserting new blog:', error);
                throw new Error('Failed to create blog');
            }
        });
    },
    find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Поиск по _id (используем ObjectId)
            const blog = yield mongoDb_1.blogsCollection.findOne({ id: id }, { projection: { _id: 0 } });
            return blog ? Object.assign(Object.assign({}, blog), { id: blog.id }) : null; // Возвращаем объект с id
        });
    },
    findAndMap(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield this.find(id);
            return blog ? this.map(blog) : undefined; // Возвращаем отображаемую модель
        });
    },
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const blogs = yield mongoDb_1.blogsCollection.find({}, { projection: { _id: 0 } }).toArray();
            return blogs.map(blog => (Object.assign(Object.assign({}, blog), { id: blog.id }))); // Обновляем все блоги с id
        });
    },
    del(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongoDb_1.blogsCollection.deleteOne({ id: id });
            return result.deletedCount ? { id } : null; // Возвращаем id удаленного блога
        });
    },
    put(blog, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongoDb_1.blogsCollection.updateOne({ id: id }, { $set: blog });
            return result.modifiedCount ? { id } : null; // Возвращаем id обновленного блога
        });
    },
    map(blog) {
        return {
            id: blog.id, // Возвращаем id (так как он уже установлен)
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership,
        };
    }
};
