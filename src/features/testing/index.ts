import { Router } from "express";
import { client } from "../../db/mongoDb"; // Импортируем client из mongoDb
import { clearDatabase } from "../../db/mongoDb";
import {adminMiddleware} from "../../global_middlewares/admin-middleware"; // Импортируем функцию для очистки базы данных

export const testingRouter = Router();

testingRouter.delete('/all-data', async (req, res) => {
    // Эндпоинт для удаления всех данных из базы данных

    try {
         const db = client.db("blogs-platform");
        await db.command({ ping: 1 }); // Проверка на подключение по выполнению команды ping
        await clearDatabase(db);
        console.log("DELETE")// Вызываем функцию очистки базы данных
        res.sendStatus(204); // Возвращаем статус 204

    } catch (err) {
        console.error("Ошибка при удалении всех данных:", err);
        res.status(500).send("Ошибка сервера"); // Возвращаем статус 500 в случае ошибки
    }
});