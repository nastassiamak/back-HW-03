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
    //Этот метод создает новый блог. Он принимает объект BlogInputModel, создает новый объект BlogDbType,
    //добавляет его в массив db.blogs, и затем возвращает уникальный ID нового блога.
    create(blog) {
        return __awaiter(this, void 0, void 0, function* () {
            // Убедитесь, что коллекция инициализирована
            if (!mongoDb_1.blogsCollection) {
                throw new Error("blogsCollection не инициализирована.");
            }
            const newBlog = {
                id: new Date().toISOString() + Math.random(),
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl,
                createdAt: new Date().toISOString(),
                isMembership: false,
            };
            const res = yield mongoDb_1.blogsCollection.insertOne(newBlog);
            return newBlog;
        });
    },
    //Этот метод находит блог по его ID, переданному в функцию.
    //Если блог найден, он будет возвращен, в противном случае — undefined.
    find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield mongoDb_1.blogsCollection.findOne({ id });
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
            return yield mongoDb_1.blogsCollection.find().toArray();
        });
    },
    //Метод для удаления блога по ID.
    del(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongoDb_1.blogsCollection.deleteOne({ id });
            return result.deletedCount ? { id } : null;
        });
    },
    //Метод для обновления существующего блога по ID.
    put(blog, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongoDb_1.blogsCollection.updateOne({ id }, { $set: blog });
            return result.modifiedCount ? { id } : null;
        });
    },
    //Этот метод преобразует BlogDbType в BlogViewModel, индивидуально выбирая нужные поля для вывода.
    map(blog) {
        const blogForOutput = {
            id: blog.id,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            name: blog.name,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership,
        };
        return blogForOutput;
    },
};
