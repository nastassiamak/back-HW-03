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
const mongoDb_1 = require("../../db/mongoDb");
exports.testingRouter = (0, express_1.Router)();
exports.testingRouter.delete('/all-data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (mongoDb_1.blogsCollection) {
            yield mongoDb_1.blogsCollection.deleteMany({}); // Удаляем все документы из коллекции блогов
            console.log("Все блоги были удалены из коллекции.");
        }
        if (mongoDb_1.postsCollection) {
            yield mongoDb_1.postsCollection.deleteMany({}); // Удаляем все документы из коллекции постов
            console.log("Все посты были удалены из коллекции.");
        }
    }
    catch (err) {
        console.error("Ошибка при очистке базы данных:", err);
    }
}));
