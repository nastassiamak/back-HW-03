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
exports.postsCollection = exports.blogsCollection = exports.client = void 0;
exports.runDb = runDb;
exports.clearDatabase = clearDatabase;
exports.disconnectDb = disconnectDb;
const mongodb_1 = require("mongodb");
const setting_1 = require("../setting");
function runDb(url) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Запуск функции runDb");
        // Проверка на undefined
        if (!url) {
            throw new Error("Строка подключения не определена. Пожалуйста, проверьте переменные окружения.");
        }
        exports.client = new mongodb_1.MongoClient(url);
        try {
            yield exports.client.connect();
            const db = exports.client.db("blogs-platform");
            exports.blogsCollection = db.collection(setting_1.SETTINGS.PATH.BLOGS);
            exports.postsCollection = db.collection(setting_1.SETTINGS.PATH.POSTS);
            yield db.command({ ping: 1 });
            console.log("Database Connected");
            return true;
        }
        catch (err) {
            console.error("Database connection error:", err);
            yield exports.client.close();
            return false;
        }
    });
}
// Функция для очистки всей базы данных
function clearDatabase(db) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield db.dropDatabase(); // Удаляет всю базу данных
            console.log("База данных успешно очищена");
        }
        catch (err) {
            console.error("Ошибка при очистке базы данных:", err);
        }
    });
}
// Функция для отключения от базы данных
function disconnectDb() {
    return __awaiter(this, void 0, void 0, function* () {
        if (exports.client) {
            yield exports.client.close();
            console.log("Database Disconnected");
        }
    });
}
