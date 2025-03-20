"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SETTINGS = void 0;
require('dotenv').config(); // Убедитесь, что эта строка стоит на самом верху вашего файла
exports.SETTINGS = {
    // все хардкодные значения должны быть здесь, для удобства их изменения
    PORT: process.env.PORT || 3003,
    PATH: {
        BLOGS: '/blogs-platform/blogs',
        POSTS: '/blogs-platform/posts',
        TESTING: '/blogs-platform/testing',
    },
    ADMIN: process.env.ADMIN || 'admin:qwerty',
};
