//import request from 'supertest'; // Импортируйте supertest для тестирования HTTP
import { MongoMemoryServer } from 'mongodb-memory-server'; // Создаем временную базу данных
import { MongoClient } from 'mongodb';
import {blogsCollection, postsCollection, runDb} from "../src/db/mongoDb";
import {req} from "./helpers/test-helpers"; // Импортируем MongoClient



describe('/testing/all-data', () => {
    let mongoServer: MongoMemoryServer;
    let client: MongoClient;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        client = new MongoClient(uri);
        await client.connect();


        await runDb(uri); // Инициализация базы данных
    });

    afterAll(async () => {
        await client.close();
        await mongoServer.stop();
    });

    beforeEach(async () => {
        // Очищаем коллекции перед каждым тестом
        await blogsCollection.deleteMany({});
        await postsCollection.deleteMany({});
    });

    it('should delete all data', async () => {
        // Добавляем несколько документов для тестирования
        await blogsCollection.insertMany([
            {
                id: new Date().toISOString()+Math.random().toString(), name: 'Blog 1', description: 'First blog', websiteUrl: 'http://example.com/1', createdAt: new Date().toISOString(), isMembership: false },
            { id: new Date().toISOString()+Math.random().toString(), name: 'Blog 2', description: 'Second blog', websiteUrl: 'http://example.com/2', createdAt: new Date().toISOString(), isMembership: true },
        ]);

        // Выполняем DELETE запрос
        const response = await req
            .delete('/testing/all-data')
            .expect(204); // Проверяем, что ответ имеет статус 204

        // Проверяем, что коллекции опустошены
        const blogsCount = await blogsCollection.countDocuments({});
        const postsCount = await postsCollection.countDocuments({});

        expect(blogsCount).toBe(0);  // Количество блогов должно быть 0
        expect(postsCount).toBe(0);  // Количество постов должно быть 0
    });
});