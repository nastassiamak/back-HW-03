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
exports.disconnectDb = disconnectDb;
const mongodb_1 = require("mongodb");
const setting_1 = require("../setting");
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
            exports.blogsCollection = db.collection(setting_1.SETTINGS.PATH.BLOGS);
            exports.postsCollection = db.collection(setting_1.SETTINGS.PATH.POSTS);
            // **Добавляем код для вывода существующих баз данных и коллекций**
            const databasesList = yield client.db().admin().listDatabases();
            console.log("Доступные базы данных:");
            databasesList.databases.forEach(db => console.log(` - ${db.name}`));
            const collections = yield db.listCollections().toArray();
            console.log("Существующие коллекции в базе данных:", collections);
            // Проверка, что коллеция действительно создана
            const blogs = yield exports.blogsCollection.find().toArray();
            console.log("Блоги в коллекции:", blogs); // Здесь должен быть ваш блог
            if (blogs.length === 0) {
                console.log("Коллекция пуста или не была создана.");
            }
            else {
                console.log("Документы в коллекции успешно загружены.");
            }
            // Проверка, что коллеция действительно создана
            const posts = yield exports.postsCollection.find().toArray();
            console.log("Блоги в коллекции:", posts); // Здесь должен быть ваш блог
            if (posts.length === 0) {
                console.log("Коллекция пуста или не была создана.");
            }
            else {
                console.log("Документы в коллекции успешно загружены.");
            }
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
// Функция для отключения от базы данных
function disconnectDb() {
    return __awaiter(this, void 0, void 0, function* () {
        if (client) {
            yield client.close();
            console.log("Database Disconnected");
        }
    });
}
