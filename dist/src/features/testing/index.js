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
exports.testingRouter = void 0;
const express_1 = require("express");
const mongoDb_1 = require("../../db/mongoDb"); // Импортируем client из mongoDb
const mongoDb_2 = require("../../db/mongoDb");
exports.testingRouter = (0, express_1.Router)();
exports.testingRouter.delete('/all-data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Эндпоинт для удаления всех данных из базы данных
    try {
        const db = mongoDb_1.client.db("blogs-platform");
        yield db.command({ ping: 1 }); // Проверка на подключение по выполнению команды ping
        yield (0, mongoDb_2.clearDatabase)(db);
        console.log("DELETE"); // Вызываем функцию очистки базы данных
        res.sendStatus(204); // Возвращаем статус 204
    }
    catch (err) {
        console.error("Ошибка при удалении всех данных:", err);
        res.status(500).send("Ошибка сервера"); // Возвращаем статус 500 в случае ошибки
    }
}));
