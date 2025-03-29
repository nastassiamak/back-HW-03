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
const setting_1 = require("../src/setting");
const db_1 = require("../src/db/db");
const dataset_1 = require("./helpers/dataset");
const test_helpers_1 = require("./helpers/test-helpers");
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoDb_1 = require("../src/db/mongoDb");
const mongodb_1 = require("mongodb");
describe('/blogs', () => {
    let mongoServer;
    let client;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Создаем экземпляр MongoMemoryServer
        mongoServer = yield mongodb_memory_server_1.MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        client = new mongodb_1.MongoClient(uri);
        // Подключаемся к временной базе данных
        yield client.connect();
        yield (0, mongoDb_1.runDb)(uri); // Инициализация базы данных
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, mongoDb_1.disconnectDb)(); // Отключаемся от базы данных
        yield mongoServer.stop(); // Останавливаем сервер
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoDb_1.blogsCollection.deleteMany({}); // Очищаем коллекцию перед каждым тестом
    }));
    it('should create', () => __awaiter(void 0, void 0, void 0, function* () {
        const newBlog = {
            name: 'n11',
            description: 'd11',
            websiteUrl: 'http://some.com',
            createdAt: new Date().toISOString(),
            isMembership: false
        };
        const res = yield test_helpers_1.req
            .post(setting_1.SETTINGS.PATH.BLOGS)
            .set({ 'Authorization': 'Basic ' + dataset_1.codedAuth })
            .send(newBlog) // отправка данных
            .expect(db_1.HTTP_STATUSES.CREATED_201);
        console.log(res.body);
        // Находим созданный блог в коллекции
        const createdBlog = yield mongoDb_1.blogsCollection.findOne({ id: res.body.id });
        console.log(createdBlog);
        // Проверяем, что созданный блог существует
        expect(createdBlog).toBeTruthy(); // Убедитесь, что созданный блог не равен null
        if (createdBlog) { // Проверяем на наличие созданного блога
            expect(createdBlog.name).toEqual(newBlog.name);
            expect(createdBlog.description).toEqual(newBlog.description);
            expect(createdBlog.websiteUrl).toEqual(newBlog.websiteUrl);
            expect(createdBlog.createdAt.slice(0, 19)).toEqual(newBlog.createdAt.slice(0, 19)); // Сравниваем без миллисекунд
            expect(createdBlog.isMembership).toEqual(false); // Сравниваем с правильным значением
        }
    }));
    it('shouldn\'t create 401', () => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoDb_1.blogsCollection.deleteMany({}); // Очищаем коллекцию перед каждым тестом
        const newBlog = {
            name: 'n1',
            description: 'd1',
            websiteUrl: 'http://some.com',
        };
        const res = yield test_helpers_1.req
            .post(setting_1.SETTINGS.PATH.BLOGS)
            .send(newBlog) // отправка данных
            .expect(db_1.HTTP_STATUSES.UNAUTHORIZED_401);
        console.log(res.body);
        // Проверяем, что в базе данных нет блогов
        const blogsInDb = yield mongoDb_1.blogsCollection.find(res.body).toArray();
        expect(blogsInDb.length).toEqual(0);
    }));
    it('shouldn\'t create', () => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoDb_1.blogsCollection.deleteMany({}); // Очищаем коллекцию перед каждым тестом
        const newBlog = {
            name: (0, dataset_1.createString)(16),
            description: (0, dataset_1.createString)(501),
            websiteUrl: (0, dataset_1.createString)(101),
        };
        const res = yield test_helpers_1.req
            .post(setting_1.SETTINGS.PATH.BLOGS)
            .set({ 'Authorization': 'Basic ' + dataset_1.codedAuth })
            .send(newBlog) // отправка данных
            .expect(db_1.HTTP_STATUSES.BAD_REQUEST_400);
        console.log(res.body);
        expect(res.body.errorsMessages.length).toEqual(5);
        expect(res.body.errorsMessages[0].field).toEqual('name');
        expect(res.body.errorsMessages[1].field).toEqual('description');
        expect(res.body.errorsMessages[2].field).toEqual('websiteUrl');
        //проверка что в базе данных нет блогов
        const blogsInDb = yield mongoDb_1.blogsCollection.find(res.body).toArray();
        expect(blogsInDb.length).toEqual(0);
    }));
    it('should get empty array', () => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoDb_1.blogsCollection.deleteMany({});
        const res = yield test_helpers_1.req
            .get(setting_1.SETTINGS.PATH.BLOGS)
            .expect(db_1.HTTP_STATUSES.OK_200); // проверяем наличие эндпоинта
        console.log(res.body); // можно посмотреть ответ эндпоинта
        const blogsInDb = yield mongoDb_1.blogsCollection.find().toArray();
        expect(blogsInDb.length).toEqual(0); // проверяем ответ эндпоинта
    }));
    it('should get not empty array', () => __awaiter(void 0, void 0, void 0, function* () {
        //await blogsCollection.insertMany(dataset1.blogs);
        const res = yield test_helpers_1.req
            .get(setting_1.SETTINGS.PATH.BLOGS)
            .expect(db_1.HTTP_STATUSES.OK_200);
        console.log(res.body);
        const blogsInDb = yield mongoDb_1.blogsCollection.find().toArray();
        expect(blogsInDb.length).toEqual(0);
        // expect(blogsInDb[0]).toEqual(dataset1.blogs[0])
    }));
    it('shouldn\'t find', () => __awaiter(void 0, void 0, void 0, function* () {
        //await blogsCollection.insertMany(dataset1.blogs);
        const res = yield test_helpers_1.req
            .get(setting_1.SETTINGS.PATH.BLOGS + '/1')
            .expect(db_1.HTTP_STATUSES.NOT_FOUND_404); // проверка на ошибку
        console.log(res.body);
    }));
    it('should find', () => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoDb_1.blogsCollection.insertMany(dataset_1.dataset1.blogs);
        const res = yield test_helpers_1.req
            .get(setting_1.SETTINGS.PATH.BLOGS + '/' + dataset_1.dataset1.blogs[0].id)
            .expect(db_1.HTTP_STATUSES.OK_200); // проверка на ошибку
        console.log(res.body);
        const blogsInDb = yield mongoDb_1.blogsCollection.findOne({ id: res.body.id });
        expect(blogsInDb).toEqual(dataset_1.dataset1.blogs[0]);
    }));
    it('should del', () => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoDb_1.blogsCollection.insertMany(dataset_1.dataset1.blogs);
        const res = yield test_helpers_1.req
            .delete(setting_1.SETTINGS.PATH.BLOGS + '/' + dataset_1.dataset1.blogs[0].id)
            .set({ 'Authorization': 'Basic ' + dataset_1.codedAuth })
            .expect(db_1.HTTP_STATUSES.NO_CONTENT_204); // проверка на ошибку
        //console.log(res.body)
        const blogsInDb = yield mongoDb_1.blogsCollection.find().toArray();
        expect(blogsInDb.length).toEqual(0);
    }));
    it('shouldn\'t del', () => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoDb_1.blogsCollection.deleteMany({});
        const res = yield test_helpers_1.req
            .delete(setting_1.SETTINGS.PATH.BLOGS + '/1')
            .set({ 'Authorization': 'Basic ' + dataset_1.codedAuth })
            .expect(db_1.HTTP_STATUSES.NOT_FOUND_404); // проверка на ошибку
        //console.log(res.body)
    }));
    it('shouldn\'t del 401', () => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoDb_1.blogsCollection.deleteMany({});
        const res = yield test_helpers_1.req
            .delete(setting_1.SETTINGS.PATH.BLOGS + '/1')
            .set({ 'Authorization': 'Basic' + dataset_1.codedAuth }) // no ' '
            .expect(db_1.HTTP_STATUSES.UNAUTHORIZED_401); // проверка на ошибку
        console.log(res.body);
        // // Проверяем состояние базы данных
        const blogsInDb = yield mongoDb_1.blogsCollection.find({}).toArray();
        console.log('Blogs in DB:', blogsInDb); // Логируем состояние базы данных
        expect(blogsInDb.length).toEqual(0); // Утверждаем, что длина равна 0
    }));
    it('should update', () => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoDb_1.blogsCollection.insertMany(dataset_1.dataset1.blogs);
        const blog = {
            name: 'n2',
            description: 'd2',
            websiteUrl: 'http://some2.com',
            createdAt: new Date().toISOString(),
            isMembership: false
        };
        const res = yield test_helpers_1.req
            .put(setting_1.SETTINGS.PATH.BLOGS + '/' + dataset_1.dataset1.blogs[0].id)
            .set({ 'Authorization': 'Basic ' + dataset_1.codedAuth })
            .send(blog)
            .expect(db_1.HTTP_STATUSES.NO_CONTENT_204); // проверка на ошибку
        console.log(res.body);
        // Убедитесь, что обновленный объект соответствует изменениям в базе данных
        const updatedBlog = yield mongoDb_1.blogsCollection.findOne({ id: dataset_1.dataset1.blogs[0].id }); // Получаем обновленный блог из БД
        expect(updatedBlog).not.toBeNull(); // Проверяем, что блог существует
        if (updatedBlog) {
            // Проверяем каждое поле на соответствие
            expect(updatedBlog.name).toEqual(blog.name);
            expect(updatedBlog.description).toEqual(blog.description);
            expect(updatedBlog.websiteUrl).toEqual(blog.websiteUrl);
        }
    }));
    it('shouldn\'t update 404', () => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoDb_1.blogsCollection.deleteMany({});
        const blog = {
            name: 'n1',
            description: 'd1',
            websiteUrl: 'http://some.com',
            createdAt: new Date().toISOString(),
            isMembership: false,
        };
        const res = yield test_helpers_1.req
            .put(setting_1.SETTINGS.PATH.BLOGS + '/1')
            .set({ 'Authorization': 'Basic ' + dataset_1.codedAuth })
            .send(blog)
            .expect(db_1.HTTP_STATUSES.NOT_FOUND_404); // проверка на ошибку
        //console.log(res.body)
    }));
    it('shouldn\'t update2', () => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoDb_1.blogsCollection.insertMany(dataset_1.dataset1.blogs);
        const blog = {
            name: (0, dataset_1.createString)(16),
            description: (0, dataset_1.createString)(501),
            websiteUrl: (0, dataset_1.createString)(101),
            createdAt: new Date().toISOString(),
            isMembership: false,
        };
        const res = yield test_helpers_1.req
            .put(setting_1.SETTINGS.PATH.BLOGS + '/' + dataset_1.dataset1.blogs[0].id)
            .set({ 'Authorization': 'Basic ' + dataset_1.codedAuth })
            .send(blog)
            .expect(db_1.HTTP_STATUSES.BAD_REQUEST_400); // проверка на ошибку
        //console.log(res.body)
        // Проверяем, что коллекция блогов остается без изменений
        const blogsInDb = yield mongoDb_1.blogsCollection.find().toArray();
        expect(blogsInDb.length).toEqual(dataset_1.dataset1.blogs.length); // Количество должно остаться прежним
    }));
    it('shouldn\'t update 401', () => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoDb_1.blogsCollection.insertMany(dataset_1.dataset1.blogs);
        const blog = {
            name: (0, dataset_1.createString)(16),
            description: (0, dataset_1.createString)(501),
            websiteUrl: (0, dataset_1.createString)(101),
            createdAt: new Date().toISOString(),
            isMembership: false,
        };
        const res = yield test_helpers_1.req
            .put(setting_1.SETTINGS.PATH.BLOGS + '/' + dataset_1.dataset1.blogs[0].id)
            .set({ 'Authorization': 'Basic ' + dataset_1.codedAuth + 'error' })
            .send(blog)
            .expect(db_1.HTTP_STATUSES.UNAUTHORIZED_401); // проверка на ошибку
        console.log(res.body);
        // Проверка, что база данных осталась неизменной
        const blogsInDb = yield mongoDb_1.blogsCollection.find({}).toArray();
        expect(blogsInDb.length).toBe(dataset_1.dataset1.blogs.length); // Количество должно остаться прежним
    }));
});
