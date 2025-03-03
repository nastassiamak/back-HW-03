"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRepository = void 0;
const db_1 = require("../../db/db");
exports.blogsRepository = {
    //Этот метод создает новый блог. Он принимает объект BlogInputModel, создает новый объект BlogDbType,
    //добавляет его в массив db.blogs, и затем возвращает уникальный ID нового блога.
    create(blog) {
        const newBlog = {
            id: new Date().toISOString() + Math.random(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
        };
        db_1.db.blogs = [...db_1.db.blogs, newBlog];
        return newBlog.id;
    },
    //Этот метод находит блог по его ID, переданному в функцию.
    //Если блог найден, он будет возвращен, в противном случае — undefined.
    find(id) {
        return db_1.db.blogs.find(b => b.id === id);
    },
    //Сначала вызывает метод find, чтобы получить блог по ID,
    // затем использует метод map, чтобы преобразовать его в формат BlogViewModel.
    // Обратите внимание на использование !, который указывает TypeScript,
    // что вы уверены в наличии блога (т.е. blog не равен undefined).
    findAndMap(id) {
        const blog = this.find(id); // использовать этот метод если проверили существование
        return this.map(blog);
    },
    //Этот метод должен возвращать все блоги.
    getAll() {
        return db_1.db.blogs.map(this.map); //возвращаем все блоги в формате BlogViewModel
    },
    //Метод для удаления блога по ID.
    del(id) {
        const index = db_1.db.blogs.findIndex(b => b.id === id);
        if (index !== -1) {
            const deletedBlog = db_1.db.blogs[index]; // Сохраняем удалить объект
            db_1.db.blogs.splice(index, 1); // Удаляем блог из массива
            return deletedBlog; // Возвращаем удаленный объект
        }
        return null; // Возвращаем null, если блог не найден
    },
    //Метод для обновления существующего блога по ID.
    put(blog, id) {
        const index = db_1.db.blogs.findIndex(b => b.id === id);
        if (index === -1) {
            return null; // Возвращаем null, если блог не найден
        }
        // Здесь можно добавить возможность обновления и возвращения обновленного блога
        db_1.db.blogs[index] = Object.assign(Object.assign({}, db_1.db.blogs[index]), blog); // Обновление блога
        return db_1.db.blogs[index]; // Возврат обновленного блога
    },
    //Этот метод преобразует BlogDbType в BlogViewModel, индивидуально выбирая нужные поля для вывода.
    map(blog) {
        const blogForOutput = {
            id: blog.id,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            name: blog.name,
        };
        return blogForOutput;
    },
};
