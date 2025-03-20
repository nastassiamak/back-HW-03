require('dotenv').config(); // Убедитесь, что эта строка стоит на самом верху вашего файла


export const SETTINGS = {
    // все хардкодные значения должны быть здесь, для удобства их изменения
    PORT: process.env.PORT || 3003,
    PATH: {
        BLOGS: '/blogs-platform/blogs',
        POSTS: '/blogs-platform/posts',
        TESTING: '/blogs-platform/testing',
    },
    ADMIN: process.env.ADMIN || 'admin:qwerty',
}
