import {BlogInputModel} from "../src/input-output-type/blog_type";
import {SETTINGS} from "../src/setting";
import {HTTP_STATUSES, setDB} from "../src/db/db";
import {codedAuth, createString, dataset1} from "./helpers/dataset";
import {req} from "./helpers/test-helpers";
import {MongoMemoryServer} from "mongodb-memory-server";
import {blogsCollection, disconnectDb, runDb} from "../src/db/mongoDb";
import {MongoClient, ObjectId} from "mongodb";

describe('/blogs', () => {
    let mongoServer: MongoMemoryServer;
    let client: MongoClient;

    beforeAll(async () => {
        // Создаем экземпляр MongoMemoryServer
        mongoServer = await MongoMemoryServer.create();
         const uri = mongoServer.getUri();
        client = new MongoClient(uri);


        // Подключаемся к временной базе данных
        await client.connect();
        await runDb(uri); // Инициализация базы данных

    });

    afterAll(async () => {
        await disconnectDb(); // Отключаемся от базы данных
        await mongoServer.stop(); // Останавливаем сервер
    });

    beforeEach(async () => {
        await blogsCollection.deleteMany({}); // Очищаем коллекцию перед каждым тестом
    });


    it('should create', async () => {

        const newBlog = {
           //id: new Date().toISOString() + Math.random().toString(),
            name: "new blog",
            description: "description",
            websiteUrl: "https://someurl.com",
            createdAt: new Date().toISOString(), // Генерация текущего времени в формате ISO
            isMembership: false // Установлено значение по умолчанию
        }

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set({'Authorization': 'Basic ' + codedAuth})
            .send(newBlog) // отправка данных
            .expect(HTTP_STATUSES.CREATED_201)

        console.log(res.body)


        // Находим созданный блог в коллекции
        const createdBlog = await blogsCollection.findOne({id: res.body.id},{projection: {_id: 0}});

        console.log(createdBlog);
        // Проверяем, что созданный блог существует
        expect(createdBlog).not.toBeNull(); // Убедитесь, что созданный блог не равен null

        if (createdBlog) { // Проверяем на наличие созданного блога

            expect(createdBlog.name).toEqual(newBlog.name);
            expect(createdBlog.description).toEqual(newBlog.description);
            expect(createdBlog.websiteUrl).toEqual(newBlog.websiteUrl);
            expect(createdBlog.createdAt).toBeDefined();
           expect(createdBlog.isMembership).toEqual(false); // Сравниваем с правильным значением
        }
        console.log(createdBlog);
    });

    it('shouldn\'t create 401', async () => {
        await blogsCollection.deleteMany({}); // Очищаем коллекцию перед каждым тестом
        const newBlog: BlogInputModel = {
            name: 'n1',
            description: 'd1',
            websiteUrl: 'http://some.com',

        }

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .send(newBlog) // отправка данных
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)

        console.log(res.body)

        // Проверяем, что в базе данных нет блогов
        const blogsInDb = await blogsCollection.find(res.body).toArray();
        expect(blogsInDb.length).toEqual(0);
        console.log(blogsInDb)
    })

    it('shouldn\'t create', async () => {
        await blogsCollection.deleteMany({}); // Очищаем коллекцию перед каждым тестом
        const newBlog: BlogInputModel = {
            name: createString(16),
            description: createString(501),
            websiteUrl: createString(101),

        }

        const res = await req
            .post(SETTINGS.PATH.BLOGS)
            .set({'Authorization': 'Basic ' + codedAuth})
            .send(newBlog) // отправка данных
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        console.log(res.body)

        expect(res.body.errorsMessages.length).toEqual(3)
        expect(res.body.errorsMessages[0].field).toEqual('name')
        expect(res.body.errorsMessages[1].field).toEqual('description')
        expect(res.body.errorsMessages[2].field).toEqual('websiteUrl')

        //проверка что в базе данных нет блогов
        const blogsInDb = await blogsCollection.find(res.body).toArray();
        expect(blogsInDb.length).toEqual(0);
        console.log(blogsInDb)

    })

    it('should get empty array', async () => {
      // await blogsCollection.deleteMany({});

        const res = await req
            .get(SETTINGS.PATH.BLOGS)
            .expect(HTTP_STATUSES.OK_200) // проверяем наличие эндпоинта

        console.log(res.body) // можно посмотреть ответ эндпоинта
        const blogsInDb = await blogsCollection.find({projection: { _id: 0 }}).toArray();
        expect(blogsInDb.length).toEqual(0) // проверяем ответ эндпоинта
    })

    it('should get not empty array', async () => {
        // Вставляем блоги перед выполнением теста
        await blogsCollection.insertMany(dataset1.blogs);

        const res = await req
            .get(SETTINGS.PATH.BLOGS)
            .expect(HTTP_STATUSES.OK_200);

        console.log(res.body); // Выводим полученные данные в консоль

        const blogsInDb = await blogsCollection.find().toArray();
        console.log(blogsInDb)
        // Теперь ожидаем, что длина массива не равна нулю
        expect(blogsInDb.length).toBeGreaterThan(0);

        // Дополнительная проверка, можно снова развернуть эту строку
        expect(blogsInDb[0]).toEqual(dataset1.blogs[0]); // Проверка на соответствие


    });

    it('shouldn\'t find', async () => {
        //await blogsCollection.insertMany(dataset1.blogs);

        const res = await req
            .get(`${SETTINGS.PATH.BLOGS}/nonexistent_id`)
            .expect(HTTP_STATUSES.NOT_FOUND_404) // проверка на ошибку

        console.log(res.body)
    })

    it('should find', async () => {
        await blogsCollection.insertMany(dataset1.blogs);

        const res = await req
            .get(SETTINGS.PATH.BLOGS + '/' + dataset1.blogs[0].id)
            .expect(HTTP_STATUSES.OK_200) // проверка на ошибку

        console.log(res.body)
        const blogsInDb = await blogsCollection.findOne({id: res.body.id});
       expect(blogsInDb).toEqual(dataset1.blogs[0])
    })

    it('should del', async () => {
        await blogsCollection.insertMany(dataset1.blogs);


        const blog = {
            name: 'n2',
            description: 'd2',
            websiteUrl: 'http://some2.com',
            createdAt: new Date().toISOString(),
            isMembership: false
        };

        const res = await req
            .put(SETTINGS.PATH.BLOGS + '/' + dataset1.blogs[0].id)
            .set({'Authorization': 'Basic ' + codedAuth})
            .send(blog)
            .expect(HTTP_STATUSES.NO_CONTENT_204);

        // Убедитесь, что обновленный объект соответствует изменениям в базе данных
        const updatedBlog = await blogsCollection.findOne({ id: dataset1.blogs[0].id });
        expect(updatedBlog).not.toBeNull(); // Проверяем, что блог существует

        if (updatedBlog) {
            // Проверяем каждое поле на соответствие
            expect(updatedBlog.name).toEqual(blog.name);
            expect(updatedBlog.description).toEqual(blog.description);
            expect(updatedBlog.websiteUrl).toEqual(blog.websiteUrl);
            expect(updatedBlog._id).toBeDefined(); // Проверьте, что _id определен
        }
    });

    it('shouldn\'t del', async () => {
        await blogsCollection.deleteMany({});

        const res = await req
            .delete(SETTINGS.PATH.BLOGS + '/1')
            .set({'Authorization': 'Basic ' + codedAuth})
            .expect(HTTP_STATUSES.NOT_FOUND_404) // проверка на ошибку

        //console.log(res.body)
    })

    it('shouldn\'t del 401', async () => {
        await blogsCollection.deleteMany({});

        const res = await req
            .delete(SETTINGS.PATH.BLOGS + '/1')
            .set({'Authorization': 'Basic' + codedAuth}) // no ' '
            .expect(HTTP_STATUSES.UNAUTHORIZED_401) // проверка на ошибку

        console.log(res.body)
        // // Проверяем состояние базы данных
        const blogsInDb = await blogsCollection.find({}).toArray();
        console.log('Blogs in DB:', blogsInDb); // Логируем состояние базы данных
        expect(blogsInDb.length).toEqual(0); // Утверждаем, что длина равна 0
    })

    it( 'should update blog by id', async () => {
        await blogsCollection.insertMany(dataset1.blogs); // Вставляем начальные данные

        const updatedBlog = {
            name: 'new name', // Задаем новые значения
            description: 'description',
            websiteUrl: 'http://example.com',
            isMembership: false // Убедитесь, что это соответствует вашей модели
        };

        // Отправляем запрос на обновление блога
        const res = await req
            .put(SETTINGS.PATH.BLOGS + '/' + dataset1.blogs[0].id)
            .set({'Authorization': 'Basic ' + codedAuth})
            .send(updatedBlog)
            .expect(HTTP_STATUSES.NO_CONTENT_204); // Ожидаем статус 204

        const blogFromDb = await blogsCollection.findOne({ id: dataset1.blogs[0].id }); // Получаем обновленный объект из базы данных

        // Убедитесь, что _id присутствует, а остальные поля обновлены
        expect(blogFromDb).not.toBeNull(); // Убедитесь, что блог существует
        expect(blogFromDb).toEqual({
            _id: expect.any(ObjectId), // Убедитесь, что _id - это строка
            id: dataset1.blogs[0].id,
            name: 'new name', // Ожидаемое новое значение
            description: 'description', // Ожидаемое новое значение
            websiteUrl: 'http://example.com', // Ожидаемое новое значение
            isMembership: false, // Убедитесь, что это значение также обновлено
        });
    });

    it('shouldn\'t update 404', async () => {
        await blogsCollection.deleteMany({});

        const blog = {
            name: 'n1',
            description: 'd1',
            websiteUrl: 'http://some.com',
            createdAt: new Date().toISOString(),
            isMembership: false,
        }

        const res = await req
            .put(`${SETTINGS.PATH.BLOGS}/nonexistent_id`)
            .set({'Authorization': 'Basic ' + codedAuth})
            .send(blog)
            .expect(HTTP_STATUSES.NOT_FOUND_404) // проверка на ошибку

        //console.log(res.body)
    })

    it('shouldn\'t update2', async () => {
        await blogsCollection.insertMany(dataset1.blogs);

        const blog = {
            name: createString(16),
            description: createString(501),
            websiteUrl: createString(101),
            createdAt: new Date().toISOString(),
            isMembership: false,
        }

        const res = await req
            .put(SETTINGS.PATH.BLOGS + '/' + dataset1.blogs[0].id)
            .set({'Authorization': 'Basic ' + codedAuth})
            .send(blog)
            .expect(HTTP_STATUSES.BAD_REQUEST_400) // проверка на ошибку

        //console.log(res.body)


        // Проверяем, что коллекция блогов остается без изменений
        const blogsInDb = await blogsCollection.find().toArray();
        expect(blogsInDb.length).toEqual(dataset1.blogs.length); // Количество должно остаться прежним
    })

    it('shouldn\'t update 401', async () => {
        await blogsCollection.insertMany(dataset1.blogs);

        const blog = {
            name: createString(16),
            description: createString(501),
            websiteUrl: createString(101),
            createdAt: new Date().toISOString(),
            isMembership: false,
        }

        const res = await req
            .put(SETTINGS.PATH.BLOGS + '/' + dataset1.blogs[0].id)
            .set({'Authorization': 'Basic ' + codedAuth + 'error'})
            .send(blog)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401) // проверка на ошибку

        console.log(res.body)

        // Проверка, что база данных осталась неизменной
        const blogsInDb = await blogsCollection.find({}).toArray();
        expect(blogsInDb.length).toBe(dataset1.blogs.length); // Количество должно остаться прежним
    })

})