require('dotenv').config(); // Убедитесь, что эта строка стоит на самом верху вашего файла


export const SETTINGS = {
    // все хардкодные значения должны быть здесь, для удобства их изменения
    PORT: process.env.PORT || 3003,
    PATH: {
        BLOGS: '/blogs-collection',
        POSTS: '/posts-collection',
        TESTING: '/testing',
    },
    ADMIN: process.env.ADMIN || 'admin:qwerty',
}
