import { Collection, MongoClient, Db } from 'mongodb';
import { BlogBbType } from "./blog-db-type";
import { PostDBType } from "./post-db-type";
import { SETTINGS } from "../setting";

export let client: MongoClient;
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
        const db = client.db("blogs-platform");

        blogsCollection = db.collection<BlogBbType>(SETTINGS.PATH.BLOGS);
        postsCollection = db.collection<PostDBType>(SETTINGS.PATH.POSTS);

        await db.command({ ping: 1 });
        console.log("Database Connected");
        return true;
    } catch (err) {
        console.error("Database connection error:", err);
        await client.close();
        return false;
    }
}

// Функция для очистки всей базы данных
export async function clearDatabase(db: Db): Promise<void> {
    try {
        await db.dropDatabase(); // Удаляет всю базу данных
        console.log("База данных успешно очищена");
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