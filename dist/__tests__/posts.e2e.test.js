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
const db_1 = require("../src/db/db");
const dataset_1 = require("./helpers/dataset");
const test_helpers_1 = require("./helpers/test-helpers");
const setting_1 = require("../src/setting");
const mongoDb_1 = require("../src/db/mongoDb");
const mongodb_memory_server_1 = require("mongodb-memory-server");
let mongoServer;
let client;
describe('/posts', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        mongoServer = yield mongodb_memory_server_1.MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        yield (0, mongoDb_1.runDb)(uri);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, mongoDb_1.disconnectDb)();
        yield mongoServer.stop(); // Останавливаем сервер
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        //await blogsCollection.insertMany(dataset1.blogs); // добавление блогов перед каждым тестом
        //await blogsCollection.insertMany(dataset2.blogs); //
        //await blogsCollection.deleteMany({}); // Очищаем коллекцию блогов
        yield mongoDb_1.postsCollection.deleteMany({}); // Очищаем коллекцию постов
    }));
    it('should create', () => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoDb_1.blogsCollection.insertMany(dataset_1.dataset1.blogs);
        const newPost = {
            title: 't1',
            shortDescription: 's1',
            content: 'c1',
            blogId: dataset_1.dataset1.blogs[0].id,
        };
        const res = yield test_helpers_1.req
            .post(setting_1.SETTINGS.PATH.POSTS)
            .set({ 'Authorization': 'Basic ' + dataset_1.codedAuth })
            .send(newPost)
            .expect(db_1.HTTP_STATUSES.CREATED_201);
        console.log(res.body);
        // Ожидания
        expect(res.body.title).toEqual(newPost.title);
        expect(res.body.shortDescription).toEqual(newPost.shortDescription);
        expect(res.body.content).toEqual(newPost.content);
        expect(res.body.blogId).toEqual(newPost.blogId);
        expect(res.body.blogName).toEqual(dataset_1.dataset1.blogs[0].name);
        expect(typeof res.body.id).toEqual('string');
        const postsInDb = yield mongoDb_1.postsCollection.find({}).toArray();
        expect(postsInDb.length).toEqual(1); // Проверка, что пост действительно создан
        expect(postsInDb[0]).toEqual(expect.objectContaining(res.body)); // Проверка, что полученный пост соответствует тому, что в базе
    }));
    it('shouldn\'t create 401', () => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoDb_1.postsCollection.deleteMany({});
        const newPost = {
            title: 't1',
            shortDescription: 's1',
            content: 'c1',
            blogId: dataset_1.dataset1.blogs[0].id,
        };
        const res = yield test_helpers_1.req
            .post(setting_1.SETTINGS.PATH.POSTS)
            .send(newPost)
            .expect(db_1.HTTP_STATUSES.UNAUTHORIZED_401);
        console.log(res.body);
        const postsInDb = yield mongoDb_1.postsCollection.find({}).toArray();
        expect(postsInDb.length).toEqual(0);
        //expect(db.posts.length).toEqual(0)
    }));
    it('shouldn\'t create', () => __awaiter(void 0, void 0, void 0, function* () {
        // await postsCollection.deleteMany({});
        const newPost = {
            title: (0, dataset_1.createString)(31),
            content: (0, dataset_1.createString)(1001),
            shortDescription: (0, dataset_1.createString)(101),
            blogId: '1',
        };
        const res = yield test_helpers_1.req
            .post(setting_1.SETTINGS.PATH.POSTS)
            .set({ 'Authorization': 'Basic ' + dataset_1.codedAuth })
            .send(newPost)
            .expect(db_1.HTTP_STATUSES.BAD_REQUEST_400);
        console.log(res.body);
        expect(res.body.errorsMessages.length).toEqual(4);
        expect(res.body.errorsMessages[0].field).toEqual('title');
        expect(res.body.errorsMessages[1].field).toEqual('shortDescription');
        expect(res.body.errorsMessages[2].field).toEqual('content');
        expect(res.body.errorsMessages[3].field).toEqual('blogId');
        const postsInDb = yield mongoDb_1.postsCollection.find(res.body).toArray();
        expect(postsInDb.length).toEqual(0);
        //expect(db.posts.length).toEqual(0)
    }));
    it('should  get empty array', () => __awaiter(void 0, void 0, void 0, function* () {
        //await postsCollection.deleteMany({});
        const res = yield test_helpers_1.req
            .get(setting_1.SETTINGS.PATH.POSTS)
            .expect(db_1.HTTP_STATUSES.OK_200);
        console.log(res.body);
        const postsInDb = yield mongoDb_1.postsCollection.find({}).toArray();
        expect(postsInDb.length).toEqual(0);
    }));
    it('should get not empty array', () => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoDb_1.postsCollection.insertMany(dataset_1.dataset2.posts);
        const res = yield test_helpers_1.req
            .get(setting_1.SETTINGS.PATH.POSTS)
            .expect(db_1.HTTP_STATUSES.OK_200);
        console.log(res.body);
        const postsInDb = yield mongoDb_1.postsCollection.find({}).toArray();
        expect(postsInDb.length).toEqual(1);
        expect(postsInDb[0]).toEqual(dataset_1.dataset2.posts[0]);
    }));
    it('shouldn\'t find', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield test_helpers_1.req
            .get(setting_1.SETTINGS.PATH.POSTS + '/1')
            .expect(db_1.HTTP_STATUSES.NOT_FOUND_404);
        console.log(res.body);
        const postsInDb = yield mongoDb_1.postsCollection.find({}).toArray();
        expect(postsInDb.length).toEqual(0);
    }));
    it('should find', () => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoDb_1.postsCollection.insertMany(dataset_1.dataset2.posts);
        const res = yield test_helpers_1.req
            .get(setting_1.SETTINGS.PATH.POSTS + '/' + dataset_1.dataset2.posts[0].id)
            .expect(db_1.HTTP_STATUSES.OK_200);
        console.log(res.body);
        const postsInDb = yield mongoDb_1.postsCollection.findOne({ id: res.body.id });
        expect(postsInDb).toEqual(dataset_1.dataset2.posts[0]);
    }));
    it('should delete', () => __awaiter(void 0, void 0, void 0, function* () {
        //setDB(dataset2)
        //await blogsCollection.insertMany(dataset2.blogs)
        yield mongoDb_1.postsCollection.insertMany(dataset_1.dataset2.posts);
        const res = yield test_helpers_1.req
            .delete(setting_1.SETTINGS.PATH.POSTS + '/' + dataset_1.dataset2.posts[0].id)
            .set({ 'Authorization': 'Basic ' + dataset_1.codedAuth })
            .expect(db_1.HTTP_STATUSES.NO_CONTENT_204);
        console.log(res.body);
        const postsInDb = yield mongoDb_1.postsCollection.find().toArray();
        expect(postsInDb.length).toEqual(0);
        //expect(db.posts.length).toEqual(0)
    }));
    it('shouldn\'t delete', () => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoDb_1.postsCollection.insertMany(dataset_1.dataset2.posts);
        const res = yield test_helpers_1.req
            .delete(setting_1.SETTINGS.PATH.POSTS + '/1')
            .set({ 'Authorization': 'Basic ' + dataset_1.codedAuth })
            .expect(db_1.HTTP_STATUSES.NOT_FOUND_404);
    }));
    it('shouldn\'t delete 401', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield test_helpers_1.req
            .delete(setting_1.SETTINGS.PATH.POSTS + '/1')
            .set({ 'Authorization': 'Basic ' + dataset_1.codedAuth + 'error' })
            .expect(db_1.HTTP_STATUSES.UNAUTHORIZED_401);
    }));
    it('should update', () => __awaiter(void 0, void 0, void 0, function* () {
        // await postsCollection.deleteMany({})
        yield mongoDb_1.postsCollection.insertMany(dataset_1.dataset2.posts);
        const post = {
            title: 't2',
            shortDescription: 's2',
            content: 'c2',
            blogId: dataset_1.dataset2.blogs[0].id,
        };
        const res = yield test_helpers_1.req
            .put(setting_1.SETTINGS.PATH.POSTS + '/' + dataset_1.dataset2.posts[0].id)
            .set({ 'Authorization': 'Basic ' + dataset_1.codedAuth })
            .send(post)
            .expect(db_1.HTTP_STATUSES.NO_CONTENT_204);
        console.log(res.body);
        // Убедитесь, что обновленный объект соответствует изменениям в базе данных
        const updatedPost = yield mongoDb_1.postsCollection.findOne({ id: dataset_1.dataset2.posts[0].id }); // Получаем обновленный блог из БД
        if (updatedPost) {
            // Проверяем каждое поле на соответствие
            expect(updatedPost.title).toEqual(post.title);
            expect(updatedPost.shortDescription).toEqual(post.shortDescription);
            expect(updatedPost.content).toEqual(post.content);
            expect(updatedPost.blogId).toEqual(post.blogId);
            // expect(updatedPost.name).toEqual(blog.name);
            // expect(updatedPost.description).toEqual(blog.description);
            // expect(updatedPost.websiteUrl).toEqual(blog.websiteUrl);
        }
    }));
    it('shouldn\'t update 404', () => __awaiter(void 0, void 0, void 0, function* () {
        const post = {
            title: 't1',
            shortDescription: 's1',
            content: 'c1',
            blogId: dataset_1.dataset1.blogs[0].id,
        };
        const res = yield test_helpers_1.req
            .put(setting_1.SETTINGS.PATH.POSTS + '/1')
            .set({ 'Authorization': 'Basic ' + dataset_1.codedAuth })
            .send(post)
            .expect(db_1.HTTP_STATUSES.NOT_FOUND_404);
    }));
    it('should\'t update2', () => __awaiter(void 0, void 0, void 0, function* () {
        //await blogsCollection.insertMany(dataset2.blogs)
        yield mongoDb_1.postsCollection.insertMany(dataset_1.dataset2.posts);
        //setDB(dataset2)
        const post = {
            title: (0, dataset_1.createString)(31),
            content: (0, dataset_1.createString)(1001),
            shortDescription: (0, dataset_1.createString)(101),
            blogId: '1',
        };
        const res = yield test_helpers_1.req
            .put(setting_1.SETTINGS.PATH.POSTS + '/' + dataset_1.dataset2.posts[0].id)
            .set({ 'Authorization': 'Basic ' + dataset_1.codedAuth })
            .send(post)
            .expect(db_1.HTTP_STATUSES.BAD_REQUEST_400);
        console.log(res.body);
        expect(res.body).toBeDefined(); // Проверка, что body не равно null
        // Проверка количества сообщений об ошибках
        expect(res.body.errorsMessages.length).toEqual(4);
        expect(res.body.errorsMessages[0].field).toEqual('title');
        expect(res.body.errorsMessages[1].field).toEqual('shortDescription');
        expect(res.body.errorsMessages[2].field).toEqual('content');
        expect(res.body.errorsMessages[3].field).toEqual('blogId');
        const postsInDb = yield mongoDb_1.postsCollection.find().toArray();
        expect(postsInDb.length).toEqual(1);
    }));
    it('shouldn\'t update 401', () => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoDb_1.postsCollection.insertMany(dataset_1.dataset2.posts);
        //setDB(dataset2)
        const post = {
            title: (0, dataset_1.createString)(31),
            content: (0, dataset_1.createString)(1001),
            shortDescription: (0, dataset_1.createString)(101),
            blogId: '1',
        };
        const res = yield test_helpers_1.req
            .put(setting_1.SETTINGS.PATH.POSTS + '/' + dataset_1.dataset2.posts[0].id)
            .set({ 'Authorization': 'Basic ' + dataset_1.codedAuth + 'error' })
            .send(post)
            .expect(db_1.HTTP_STATUSES.UNAUTHORIZED_401);
    }));
});
