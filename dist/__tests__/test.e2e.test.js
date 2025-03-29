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
//import request from 'supertest'; // Импортируйте supertest для тестирования HTTP
const mongodb_memory_server_1 = require("mongodb-memory-server"); // Создаем временную базу данных
const mongodb_1 = require("mongodb");
const mongoDb_1 = require("../src/db/mongoDb");
const test_helpers_1 = require("./helpers/test-helpers"); // Импортируем MongoClient
describe('/testing/all-data', () => {
    let mongoServer;
    let client;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        mongoServer = yield mongodb_memory_server_1.MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        client = new mongodb_1.MongoClient(uri);
        yield client.connect();
        yield (0, mongoDb_1.runDb)(uri); // Инициализация базы данных
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield client.close();
        yield mongoServer.stop();
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // Очищаем коллекции перед каждым тестом
        yield mongoDb_1.blogsCollection.deleteMany({});
        yield mongoDb_1.postsCollection.deleteMany({});
    }));
    it('should delete all data', () => __awaiter(void 0, void 0, void 0, function* () {
        // Добавляем несколько документов для тестирования
        yield mongoDb_1.blogsCollection.insertMany([
            {
                id: new Date().toISOString() + Math.random().toString(), name: 'Blog 1', description: 'First blog', websiteUrl: 'http://example.com/1', createdAt: new Date().toISOString(), isMembership: false
            },
            { id: new Date().toISOString() + Math.random().toString(), name: 'Blog 2', description: 'Second blog', websiteUrl: 'http://example.com/2', createdAt: new Date().toISOString(), isMembership: true },
        ]);
        // Выполняем DELETE запрос
        const response = yield test_helpers_1.req
            .delete('/testing/all-data')
            .expect(204); // Проверяем, что ответ имеет статус 204
        // Проверяем, что коллекции опустошены
        const blogsCount = yield mongoDb_1.blogsCollection.countDocuments({});
        const postsCount = yield mongoDb_1.postsCollection.countDocuments({});
        expect(blogsCount).toBe(0); // Количество блогов должно быть 0
        expect(postsCount).toBe(0); // Количество постов должно быть 0
    }));
});
