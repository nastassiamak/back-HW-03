import {Router} from "express";
import {blogsCollection, postsCollection} from "../../db/mongoDb";

export const testingRouter = Router();

testingRouter.delete('/all-data', async (req,
                                         res) => {
    // Очищаем коллекцию блогов
    await blogsCollection.deleteMany({});
    console.log("Все блоги были удалены из коллекции.");

    // Очищаем коллекцию постов
    await postsCollection.deleteMany({});
    console.log("Все посты были удалены из коллекции.");

    // Возвращаем статус 204 без содержимого
    res.sendStatus(204);

})