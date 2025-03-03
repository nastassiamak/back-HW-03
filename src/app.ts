import express from "express";
import cors from "cors";
import {SETTINGS} from "./setting";
import {blogsRouter} from "./features/blogs/blogsRouter";
import {testingRouter} from "./features/testing";
import {postsRouter} from "./features/posts/postsRouter";
import {HTTP_STATUSES} from "./db/db";

export const app = express() // создать приложение

//console.log('Аргументы командной строки:', process.argv); // Вывод аргументов
app.use(express.json()) // создание свойств-объектов body и query во всех реквестах
app.use(cors()) // разрешить любым фронтам делать запросы на наш бэк


app.get('/', (req, res) => {
    // эндпоинт, который будет показывать на верселе какая версия бэкэнда сейчас залита
    res.status(HTTP_STATUSES.OK_200).json({version: '1.0'})
})

app.use(SETTINGS.PATH.BLOGS, blogsRouter)
app.use(SETTINGS.PATH.POSTS, postsRouter)
app.use(SETTINGS.PATH.TESTING, testingRouter)


