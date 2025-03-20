import {db, HTTP_STATUSES, setDB} from "../src/db/db";
import {codedAuth, createString, dataset1, dataset2} from "./helpers/dataset";
import {PostInputModel} from "../src/input-output-type/post_type";
import {req} from "./helpers/test-helpers";
import {SETTINGS} from "../src/setting";
import {blogsCollection, disconnectDb, postsCollection, runDb} from "../src/db/mongoDb";
import {MongoClient} from "mongodb";
import {MongoMemoryServer} from "mongodb-memory-server";

let mongoServer: MongoMemoryServer;
let client: MongoClient

describe('/blogs-platform/posts', () => {
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await runDb(uri)
    });

    afterAll(async () => {
        await disconnectDb();
        await mongoServer.stop(); // Останавливаем сервер
    });
    beforeEach(async () => {
        //await blogsCollection.insertMany(dataset1.blogs); // добавление блогов перед каждым тестом
        //await blogsCollection.insertMany(dataset2.blogs); //
        //await blogsCollection.deleteMany({}); // Очищаем коллекцию блогов
        await postsCollection.deleteMany({}); // Очищаем коллекцию постов
    });


    it('should create', async () => {
       await blogsCollection.insertMany(dataset1.blogs);
        const newPost: PostInputModel = {
            title: 't1',
            shortDescription: 's1',
            content: 'c1',
            blogId: dataset1.blogs[0].id,
        }

        const res = await req
            .post(SETTINGS.PATH.POSTS)
            .set({'Authorization': 'Basic ' + codedAuth})
            .send(newPost)
            .expect(HTTP_STATUSES.CREATED_201)

        console.log(res.body)
        // Ожидания
        expect(res.body.title).toEqual(newPost.title);
        expect(res.body.shortDescription).toEqual(newPost.shortDescription);
        expect(res.body.content).toEqual(newPost.content);
        expect(res.body.blogId).toEqual(newPost.blogId);
        expect(res.body.blogName).toEqual(dataset1.blogs[0].name);
        expect(typeof res.body.id).toEqual('string');

        const postsInDb = await postsCollection.find({}).toArray();
        expect(postsInDb.length).toEqual(1); // Проверка, что пост действительно создан
        expect(postsInDb[0]).toEqual(expect.objectContaining(res.body)); // Проверка, что полученный пост соответствует тому, что в базе
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
        //await postsCollection.deleteMany({});

        const res = await req
            .get(SETTINGS.PATH.POSTS)
            .expect(HTTP_STATUSES.OK_200)

        console.log(res.body)

        const postsInDb = await postsCollection.find({}).toArray();
        expect(postsInDb.length).toEqual(0);


    })

    it('should get not empty array', async () => {
        await postsCollection.insertMany(dataset2.posts)

        const res = await req
            .get(SETTINGS.PATH.POSTS)
            .expect(HTTP_STATUSES.OK_200)

        console.log(res.body)

        const postsInDb = await postsCollection.find({}).toArray();
        expect(postsInDb.length).toEqual(1);
        expect(postsInDb[0]).toEqual(dataset2.posts[0])
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

    it('should update', async () => {
       // await postsCollection.deleteMany({})

        await postsCollection.insertMany(dataset2.posts)
        const post: PostInputModel = {
            title: 't2',
            shortDescription: 's2',
            content: 'c2',
            blogId: dataset2.blogs[0].id,
        }

        const res = await req
            .put(SETTINGS.PATH.POSTS + '/' + dataset2.posts[0].id)
            .set({'Authorization': 'Basic ' + codedAuth})
            .send(post)
            .expect(HTTP_STATUSES.NO_CONTENT_204)

        console.log(res.body)
        // Убедитесь, что обновленный объект соответствует изменениям в базе данных
        const updatedPost = await postsCollection.findOne({ id: dataset2.posts[0].id}); // Получаем обновленный блог из БД


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
    })

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

        const postsInDb = await postsCollection.find().toArray();
        expect(postsInDb.length).toEqual(1);
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