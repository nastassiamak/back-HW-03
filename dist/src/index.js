"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const setting_1 = require("./setting");
const mongoDb_1 = require("./db/mongoDb");
const startApp = () => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield (0, mongoDb_1.runDb)('mongodb+srv://admin:admin@lesson.cc5eg.mongodb.net/?retryWrites=true&w=majority&appName=lesson');
    //if (!res) process.exit(1);
    if (res) {
        console.log("Подключение к базе данных успешно!");
    }
    else {
        console.log("Не удалось подключиться к базе данных.");
    }
    app_1.app.listen(setting_1.SETTINGS.PORT, (err) => {
        err ? console.log(err) : console.log('...server started in port ' + setting_1.SETTINGS.PORT);
    });
});
startApp();
