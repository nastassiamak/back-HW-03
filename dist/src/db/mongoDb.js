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
exports.postsCollection = exports.blogsCollection = void 0;
exports.runDb = runDb;
exports.clearDb = clearDb;
exports.disconnectDb = disconnectDb;
const mongodb_1 = require("mongodb");
let client;
function runDb(url) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Запуск функции runDb");
        // Проверка на undefined
        if (!url) {
            throw new Error("Строка подключения не определена. Пожалуйста, проверьте переменные окружения.");
        }
        client = new mongodb_1.MongoClient(url);
        try {
            yield client.connect();
            const db = client.db("blogs-platform");
            exports.blogsCollection = db.collection("blogs-collection");
            exports.postsCollection = db.collection("posts-collection");
            //
            // // **Добавляем код для вывода существующих баз данных и коллекций**
            // const databasesList = await client.db().admin().listDatabases();
            // console.log("Доступные базы данных:");
            // databasesList.databases.forEach(db => console.log(` - ${db.name}`));
            //
            // const collections = await db.listCollections().toArray();
            // console.log("Существующие коллекции в базе данных:", collections);
            //
            //
            // // Проверка, что коллеция действительно создана
            // const blogs = await blogsCollection.find().toArray();
            // console.log("Блоги в коллекции:", blogs); // Здесь должен быть ваш блог
            //
            // if (blogs.length === 0) {
            //     console.log("Коллекция пуста или не была создана.");
            // } else {
            //     console.log("Документы в коллекции успешно загружены.");
            // }
            yield db.command({ ping: 1 });
            console.log("Database Connected");
            return true;
        }
        catch (err) {
            console.error("Database connection error:", err);
            yield client.close();
            return false;
        }
    });
}
function clearDb() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (exports.blogsCollection) {
                yield exports.blogsCollection.deleteMany({}); // Удаляем все документы из коллекции блогов
                console.log("Все блоги были удалены из коллекции.");
            }
            if (exports.postsCollection) {
                yield exports.postsCollection.deleteMany({}); // Удаляем все документы из коллекции постов
                console.log("Все посты были удалены из коллекции.");
            }
        }
        catch (err) {
            console.error("Ошибка при очистке базы данных:", err);
        }
    });
}
// Функция для отключения от базы данных
function disconnectDb() {
    return __awaiter(this, void 0, void 0, function* () {
        if (client) {
            yield client.close();
            console.log("Database Disconnected");
        }
    });
}
