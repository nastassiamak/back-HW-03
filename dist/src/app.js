"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const setting_1 = require("./setting");
const blogsRouter_1 = require("./features/blogs/blogsRouter");
const testing_1 = require("./features/testing");
const postsRouter_1 = require("./features/posts/postsRouter");
const db_1 = require("./db/db");
exports.app = (0, express_1.default)(); // создать приложение
//console.log('Аргументы командной строки:', process.argv); // Вывод аргументов
exports.app.use(express_1.default.json()); // создание свойств-объектов body и query во всех реквестах
exports.app.use((0, cors_1.default)()); // разрешить любым фронтам делать запросы на наш бэк
exports.app.get('/', (req, res) => {
    // эндпоинт, который будет показывать на верселе какая версия бэкэнда сейчас залита
    res.status(db_1.HTTP_STATUSES.OK_200).json({ version: '1.0' });
});
exports.app.use(setting_1.SETTINGS.PATH.BLOGS, blogsRouter_1.blogsRouter);
exports.app.use(setting_1.SETTINGS.PATH.POSTS, postsRouter_1.postsRouter);
exports.app.use(setting_1.SETTINGS.PATH.TESTING, testing_1.testingRouter);
