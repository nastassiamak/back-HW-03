import {app} from "./app";
import {SETTINGS} from "./setting";
import {runDb} from "./db/mongoDb";
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

    app.listen(SETTINGS.PORT, (err) => {
        err ? console.log(err) : console.log('...server started in port ' + SETTINGS.PORT)
    })

}
 startApp()