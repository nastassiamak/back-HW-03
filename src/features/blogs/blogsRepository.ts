import {BlogInputModel, BlogViewModel} from "../../input-output-type/blog_type";
import {BlogBbType} from "../../db/blog-db-type";
import {blogsCollection} from "../../db/mongoDb";
import {ObjectId} from "mongodb";



export const blogsRepository = {

    async create(blog: BlogInputModel) {
        // Убедитесь, что коллекция инициализирована
        if (!blogsCollection) {
            throw new Error("blogsCollection не инициализирована.");
        }

        const newBlog = {
            id: new Date().toISOString()+Math.random().toString(),

            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership:  false
        }
        try {
            // Пытаемся вставить новый блог в коллекцию
            await blogsCollection.insertOne(newBlog);
        } catch (error) {
            // Логируем ошибку, если возникла проблема
            console.error('Error inserting new blog:', error);
            // Генерируем исключение с более информативным сообщением
            throw new Error('Failed to create blog');
        }

        return newBlog; // Возвращаем успешно созданный блог

    },

    async find(id: string) {
        return await blogsCollection.findOne({ id: id })
    },

    async findAndMap(id: string) {
        const blogs = await this.find(id);// использовать этот метод если проверили существование
        return blogs ? this.map(blogs) : undefined
    },

    //Этот метод должен возвращать все блоги.
    async getAll(){
      return await blogsCollection.find().toArray();
    },

    //Метод для удаления блога по ID.
    async del(id: string) {
        const result = await blogsCollection.deleteOne({ id: id });
        return result.deletedCount ? {id}: null
    },

    //Метод для обновления существующего блога по ID.
    async put(blog: BlogInputModel, id: string) {
        const result = await blogsCollection
            .updateOne({ id:id }, {$set: blog });
        return result.modifiedCount ? {id}: null
    },

    //Этот метод преобразует BlogDbType в BlogViewModel, индивидуально выбирая нужные поля для вывода.
    map(blog: BlogBbType): BlogViewModel {
        return {
            id: blog.id, // Возвращаем _id как строку
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership,
        };
    }

}