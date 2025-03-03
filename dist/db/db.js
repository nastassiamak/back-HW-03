"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDB = exports.db = exports.HTTP_STATUSES = void 0;
exports.HTTP_STATUSES = {
    NOT_FOUND_404: 404,
    UNAUTHORIZED_401: 401,
    BAD_REQUEST_400: 400,
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204
};
exports.db = {
    blogs: [],
    posts: []
};
// функция для быстрой очистки/заполнения бд для тестов
const setDB = (dataset) => {
    var _a, _b;
    if (!dataset) { //если в функцию ничего не передано - то очищаем бд
        exports.db.blogs = [];
        exports.db.posts = [];
        return;
    }
    //если что-то передано - то заменяем старые значения новыми,
    //не ссылки - а глубокое копирование, чтобы не изменять dataset
    exports.db.blogs = ((_a = dataset.blogs) === null || _a === void 0 ? void 0 : _a.map(b => (Object.assign({}, b)))) || exports.db.blogs;
    exports.db.posts = ((_b = dataset.posts) === null || _b === void 0 ? void 0 : _b.map(p => (Object.assign({}, p)))) || exports.db.posts;
};
exports.setDB = setDB;
