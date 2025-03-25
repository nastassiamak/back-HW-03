import {Router} from "express";
import {blogsCollection, postsCollection} from "../../db/mongoDb";

export const testingRouter = Router();

testingRouter.delete('/all-data', async (req,
                                         res) => {
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


})