import {Collection, MongoClient} from 'mongodb';
import {BlogBbType} from "./blog-db-type";
import {PostDBType} from "./post-db-type";

let client: MongoClient;
export let blogsCollection: Collection<BlogBbType>;
export let postsCollection: Collection<PostDBType>;

export async function runDb(url: string): Promise<boolean> {
    console.log("Запуск функции runDb");
    // Проверка на undefined
    if (!url) {
        throw new Error("Строка подключения не определена. Пожалуйста, проверьте переменные окружения.");
    }

    client = new MongoClient(url);

    try {
        await client.connect();
        const db = client.db("blogs-platform")

        blogsCollection = db.collection<BlogBbType>('blogs-collection');
        postsCollection = db.collection<PostDBType>('posts-collection');

        // Пример создания документа (блога)
        const newBlog: BlogBbType = {
            id: new Date().toISOString() + Math.random(),
            name: 'n11111',
            description: 'd11111',
            websiteUrl: 'http://example111111.com',
            createdAt: new Date().toISOString(),
            isMembership: false,
        };

       const result = await blogsCollection.insertOne(newBlog); // Добавляем документ в коллекцию
        // Проверка результата вставки
        if (result.insertedId) {
            console.log(`Документ создан с _id: ${result.insertedId}`);
        } else {
            console.log("Документ не был добавлен.");
        }

        // **Добавляем код для вывода существующих баз данных и коллекций**
        const databasesList = await client.db().admin().listDatabases();
        console.log("Доступные базы данных:");
        databasesList.databases.forEach(db => console.log(` - ${db.name}`));

        const collections = await db.listCollections().toArray();
        console.log("Существующие коллекции в базе данных:", collections);


        // Проверка, что коллеция действительно создана
        const blogs = await blogsCollection.find().toArray();
        console.log("Блоги в коллекции:", blogs); // Здесь должен быть ваш блог

        if (blogs.length === 0) {
            console.log("Коллекция пуста или не была создана.");
        } else {
            console.log("Документы в коллекции успешно загружены.");
        }

        await db.command({ping: 1})
        console.log("Database Connected")
        return true
    } catch (err) {
        console.error("Database connection error:", err)
        await client.close();
        return false;
    }
}
export async function clearDb(): Promise<void> {
    try {
        if (blogsCollection) {
            await blogsCollection.deleteMany({}); // Удаляем все документы из коллекции блогов
            console.log("Все блоги были удалены из коллекции.");
        }

        if (postsCollection) {
            await postsCollection.deleteMany({}); // Удаляем все документы из коллекции постов
            console.log("Все посты были удалены из коллекции.");
        }
    } catch (err) {
        console.error("Ошибка при очистке базы данных:", err);
    }
}


// Функция для отключения от базы данных
    export async function disconnectDb(): Promise<void> {
        if (client) {
            await client.close();
            console.log("Database Disconnected");
        }
    }


