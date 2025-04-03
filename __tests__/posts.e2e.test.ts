import {db, HTTP_STATUSES, setDB} from "../src/db/db";
import {codedAuth, createString, dataset1, dataset2} from "./helpers/dataset";
import {PostInputModel} from "../src/input-output-type/post_type";
import {req} from "./helpers/test-helpers";
import {SETTINGS} from "../src/setting";
import {blogsCollection, disconnectDb, postsCollection, runDb} from "../src/db/mongoDb";
import {MongoClient, ObjectId} from "mongodb";
import {MongoMemoryServer} from "mongodb-memory-server";
import {postsRepository} from "../src/features/posts/postsRepository";


describe('/posts', () => {
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
    beforeEach(async () => {
       // await blogsCollection.deleteMany({})
        await postsCollection.deleteMany({}); // Очищаем коллекцию постов
    });


    it('should create', async () => {
       await blogsCollection.insertMany(dataset2.blogs);
       await postsCollection.insertMany(dataset2.posts)
        const newPost = {
            id: new Date().toISOString() +Math.random().toString(),
            title: 't1',
            shortDescription: 's1',
            content: 'c1',
            blogId: dataset2.blogs[0].id,
            blogName: dataset2.blogs[0].name,
            createdPost: new Date().toISOString(),
        }

        const res = await req
            .post(SETTINGS.PATH.POSTS)
            .set({'Authorization': 'Basic ' + codedAuth})
            .send(newPost)
            .expect(HTTP_STATUSES.CREATED_201)

        console.log(res.body)

        const createdPost = await postsCollection.findOne({id: res.body.id},{projection: {_id: 0}});
        console.log(createdPost);

        expect(createdPost).not.toBeNull();
        expect(res.body).toEqual(expect.objectContaining({
            blogId: expect.any(String),
            blogName: expect.any(String), // Обязательно проверьте наличие этого поля
            content: expect.any(String),
            createdAt: expect.stringMatching(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/), // Правильный формат даты
            id: expect.any(String),
            shortDescription: expect.any(String),
            title: expect.any(String),
        }));

    })

    it('shouldn\'t create 401', async () => {
        await postsCollection.deleteMany({});

        const newPost: PostInputModel = {
            title: 't1',
            shortDescription: 's1',
            content: 'c1',
            blogId: dataset1.blogs[0].id,
        }
        const res = await req
            .post(SETTINGS.PATH.POSTS)
            .send(newPost)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)

        console.log(res.body)

        const postsInDb = await postsCollection.find({}).toArray();
        expect(postsInDb.length).toEqual(0);
        //expect(db.posts.length).toEqual(0)
    })

    it('shouldn\'t create', async () => {
       // await postsCollection.deleteMany({});

        const newPost: PostInputModel = {
            title: createString(31),
            content: createString(1001),
            shortDescription: createString(101),
            blogId: '1',
        }
        const res = await req
            .post(SETTINGS.PATH.POSTS)
            .set({'Authorization': 'Basic ' + codedAuth})
            .send(newPost)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        console.log(res.body)

        expect(res.body.errorsMessages.length).toEqual(4)
        expect(res.body.errorsMessages[0].field).toEqual('title')
        expect(res.body.errorsMessages[1].field).toEqual('shortDescription')
        expect(res.body.errorsMessages[2].field).toEqual('content')
        expect(res.body.errorsMessages[3].field).toEqual('blogId')

        const postsInDb = await postsCollection.find(res.body).toArray();
        expect(postsInDb.length).toEqual(0);
        //expect(db.posts.length).toEqual(0)
    })

    it('should  get empty array', async () => {
        await postsCollection.deleteMany({});

        const res = await req
            .get(SETTINGS.PATH.POSTS)
            .expect(HTTP_STATUSES.OK_200)

        console.log(res.body)
        expect(res.body).toEqual([])

        const postsInDb = await postsCollection.find().toArray();
        expect(postsInDb.length).toEqual(0);



    })

    it('should get not empty array', async () => {
        await postsCollection.deleteMany({});
        await postsCollection.insertMany(dataset2.posts)

        const res = await req
            .get(SETTINGS.PATH.POSTS)
            .expect(HTTP_STATUSES.OK_200)

        console.log(res.body)

        const postsInDb = await postsCollection.find({}, {projection: {_id: 0}}).toArray();
        expect(postsInDb.length).toEqual(res.body.length);expect(res.body).toEqual(expect.arrayContaining([
            expect.objectContaining({
                // Убираем _id из проверки, если оно не возвращается
                blogId: expect.any(String),
                blogName: expect.any(String),
                content: expect.any(String),
                id: expect.any(String),
                shortDescription: expect.any(String),
                title: expect.any(String),
            }),
        ]));
    })

    it('shouldn\'t find', async () => {

        const res = await req
            .get(SETTINGS.PATH.POSTS + '/1')
            .expect(HTTP_STATUSES.NOT_FOUND_404)
        console.log(res.body)
        const postsInDb = await postsCollection.find({}).toArray();
        expect(postsInDb.length).toEqual(0);


    })


    it('should find', async () => {
       // await blogsCollection.insertMany(dataset2.blogs)
        await postsCollection.deleteMany({})
        await postsCollection.insertMany(dataset2.posts);

        const res = await req
            .get(SETTINGS.PATH.POSTS + '/' + dataset2.posts[0].id)
            .expect(HTTP_STATUSES.OK_200)

        console.log(res.body)
        const postsInDb = await postsCollection.findOne({id: res.body.id});
        expect(postsInDb).toEqual(dataset2.posts[0]);



    })

    it('should delete', async () => {
        //setDB(dataset2)
        //await blogsCollection.insertMany(dataset2.blogs)
        await postsCollection.insertMany(dataset2.posts);


        const res = await req
            .delete(SETTINGS.PATH.POSTS + '/' + dataset2.posts[0].id)
            .set({'Authorization': 'Basic ' + codedAuth})
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        console.log(res.body)
        const postsInDb = await postsCollection.find().toArray();
        expect(postsInDb.length).toEqual(0);
        //expect(db.posts.length).toEqual(0)
    })

    it('shouldn\'t delete', async () => {
        await postsCollection.insertMany(dataset2.posts);

        const res = await req
            .delete(SETTINGS.PATH.POSTS + '/1')
            .set({'Authorization': 'Basic ' + codedAuth})
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it('shouldn\'t delete 401', async () => {

        const res = await req
            .delete(SETTINGS.PATH.POSTS + '/1')
            .set({'Authorization': 'Basic ' + codedAuth + 'error'})
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)

    })
    it('should update a post by id', async () => {
       await postsCollection.insertMany(dataset2.posts); // Добавляем начальные данные

        const updatedPost = {
            title: 't2',
            shortDescription: 's2',
            content: 'c2',
            blogId: dataset2.blogs[0].id,
        };

        const res = await req
            .put(SETTINGS.PATH.POSTS + '/' + dataset2.posts[0].id)
            .set({'Authorization': 'Basic ' + codedAuth})
            .send(updatedPost)
            .expect(HTTP_STATUSES.NO_CONTENT_204); // Проверка статус ответа

        // Получаем обновленный пост из базы данных
        const postFormDb = await postsCollection.findOne({ id: dataset2.posts[0].id });
        expect(postFormDb).not.toBeNull(); // Проверяем, что пост существует

        // Применяем гибкие проверки
        expect(postFormDb).toEqual(expect.objectContaining({
            _id: expect.any(ObjectId), // Ожидаем, что это строка
            blogId: dataset2.blogs[0].id,
            blogName: dataset2.blogs[0].name, // Используем expect.any для blogName
            title: 't2',
            shortDescription: 's2',
            content: 'c2',
           // createdAt: expect.any(String), // Ожидаем любой формат для createdAt
            id: expect.any(String), // Ожидаем, что id - это строка
        }));
    });
    it('shouldn\'t update 404', async () => {

        const post: PostInputModel = {
            title: 't1',
            shortDescription: 's1',
            content:'c1',
            blogId: dataset1.blogs[0].id,
        }

        const res = await req
            .put(SETTINGS.PATH.POSTS + '/1')
            .set({'Authorization': 'Basic ' + codedAuth})
            .send(post)
            .expect(HTTP_STATUSES.NOT_FOUND_404)
    })

    it('should\'t update2', async () => {
        //await blogsCollection.insertMany(dataset2.blogs)

        await postsCollection.insertMany(dataset2.posts)
        //setDB(dataset2)
        const post: PostInputModel = {
            title: createString(31),
            content: createString(1001),
            shortDescription: createString(101),
            blogId: '1',
        }

        const res = await req
            .put(SETTINGS.PATH.POSTS + '/' + dataset2.posts[0].id)
            .set({'Authorization': 'Basic ' + codedAuth})
            .send(post)
            .expect(HTTP_STATUSES.BAD_REQUEST_400)

        console.log(res.body);

        expect(res.body).toBeDefined(); // Проверка, что body не равно null

        // Проверка количества сообщений об ошибках
        expect(res.body.errorsMessages.length).toEqual(4);
        expect(res.body.errorsMessages[0].field).toEqual('title');
        expect(res.body.errorsMessages[1].field).toEqual('shortDescription');
        expect(res.body.errorsMessages[2].field).toEqual('content');
        expect(res.body.errorsMessages[3].field).toEqual('blogId');

        // const postsInDb = await postsCollection.find().toArray();
        // expect(postsInDb.length).toEqual(1);
    })

    it('shouldn\'t update 401', async () => {

        await postsCollection.insertMany(dataset2.posts)
        //setDB(dataset2)
        const post: PostInputModel = {
            title: createString(31),
            content: createString(1001),
            shortDescription: createString(101),
            blogId: '1',
        }

        const res = await req
            .put(SETTINGS.PATH.POSTS + '/' + dataset2.posts[0].id)
            .set({'Authorization': 'Basic ' + codedAuth + 'error'})
            .send(post)
            .expect(HTTP_STATUSES.UNAUTHORIZED_401)


    })
})