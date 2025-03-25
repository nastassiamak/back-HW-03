import {MongoMemoryServer} from "mongodb-memory-server";
import {MongoClient} from "mongodb";
import {blogsCollection, disconnectDb, postsCollection, runDb} from "../src/db/mongoDb";
import {req} from "./helpers/test-helpers";
import {SETTINGS} from "../src/setting";

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
        await disconnectDb(); // Отключаемся от базы данных
        await mongoServer.stop(); // Останавливаем сервер
    });

    beforeEach(async () => {
        await blogsCollection.deleteMany({});
        await postsCollection.deleteMany({});
    });

    it('should delete all data', async () => {
        // Добавьте данные для проверки
        // await blogsCollection.insertMany([
        //     { name: 'Blog 1', description: 'Description 1', websiteUrl: 'http://example.com/1' },
        // ]);

        const response = await req
            .delete(`${SETTINGS.PATH.TESTING}/all-data`)
            .expect(204);

        console.log(response.body)
        console.log("Запрос завершен")
        const blogsCount = await blogsCollection.countDocuments({});
        //const postsCount = await postsCollection.countDocuments({});

        expect(blogsCount).toBe(0);
        //expect(postsCount).toBe(0);
    }, 5000);
});
