import {Collection, MongoClient} from 'mongodb';
import {BlogBbType} from "./blog-db-type";
import {PostDBType} from "./post-db-type";
import {SETTINGS} from "../setting";

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

        blogsCollection = db.collection<BlogBbType>("blogs-collection");
        postsCollection = db.collection<PostDBType>("posts-collection");

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
        // Проверка, что коллеция действительно создана
        const posts = await postsCollection.find().toArray();
        console.log("Блоги в коллекции:", posts); // Здесь должен быть ваш блог

        if (posts.length === 0) {
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


