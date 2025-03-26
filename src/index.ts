import {app} from "./app";
import {SETTINGS} from "./setting";
import {blogsCollection, postsCollection, runDb} from "./db/mongoDb";
import dotenv from 'dotenv'
dotenv.config()

const startApp = async () => {

    const res = await runDb('mongodb+srv://admin:admin@lesson.cc5eg.mongodb.net/?retryWrites=true&w=majority&appName=lesson')
    //if (!res) process.exit(1);
    if (res) {
        console.log("Подключение к базе данных успешно!");
    } else {
        console.log("Не удалось подключиться к базе данных.");
    }
    app.delete('/testing/all-data', async (req, res) => {
        try {
            // Очищаем коллекцию блогов
            await blogsCollection.deleteMany({});
            // Очищаем коллекцию постов
            await postsCollection.deleteMany({});

            res.status(204).send(); // Ответ без содержимого
        } catch (error) {
            console.error("Ошибка при очистке данных:", error);
            res.status(500).send("Ошибка сервера");
        }
    });

    app.listen(SETTINGS.PORT, (err) => {
        err ? console.log(err) : console.log('...server started in port ' + SETTINGS.PORT)
    })

}
 startApp()