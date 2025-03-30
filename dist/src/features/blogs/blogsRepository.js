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
const mongoDb_1 = require("../../db/mongoDb");
exports.blogsRepository = {
    create(blog) {
        return __awaiter(this, void 0, void 0, function* () {
            // Убедитесь, что коллекция инициализирована
            if (!mongoDb_1.blogsCollection) {
                throw new Error("blogsCollection не инициализирована.");
            }
            const newBlog = {
                id: new Date().toISOString() + Math.random().toString(),
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl,
                createdAt: new Date().toISOString(),
                isMembership: false
            };
            try {
                // Пытаемся вставить новый блог в коллекцию
                yield mongoDb_1.blogsCollection.insertOne(newBlog);
            }
            catch (error) {
                // Логируем ошибку, если возникла проблема
                console.error('Error inserting new blog:', error);
                // Генерируем исключение с более информативным сообщением
                throw new Error('Failed to create blog');
            }
            return newBlog; // Возвращаем успешно созданный блог
        });
    },
    find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield mongoDb_1.blogsCollection.findOne({ id: id });
        });
    },
    findAndMap(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const blogs = yield this.find(id); // использовать этот метод если проверили существование
            return blogs ? this.map(blogs) : undefined;
        });
    },
    //Этот метод должен возвращать все блоги.
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield mongoDb_1.blogsCollection.find({}, { projection: { _id: 0 } }).toArray();
        });
    },
    //Метод для удаления блога по ID.
    del(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongoDb_1.blogsCollection.deleteOne({ id: id });
            return result.deletedCount ? { id } : null;
        });
    },
    //Метод для обновления существующего блога по ID.
    put(blog, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongoDb_1.blogsCollection
                .updateOne({ id: id }, { $set: blog });
            return result.modifiedCount ? { id } : null;
        });
    },
    //Этот метод преобразует BlogDbType в BlogViewModel, индивидуально выбирая нужные поля для вывода.
    map(blog) {
        return {
            id: blog.id, // Возвращаем _id как строку
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership,
        };
    }
};
