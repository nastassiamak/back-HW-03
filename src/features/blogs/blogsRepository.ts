import {BlogInputModel, BlogViewModel} from "../../input-output-type/blog_type";
import {BlogBbType} from "../../db/blog-db-type";
import {blogsCollection} from "../../db/mongoDb";
import {ObjectId} from "mongodb";



export const blogsRepository = {

    async create(blog: BlogInputModel) {
        if (!blogsCollection) {
            throw new Error("blogsCollection не инициализирована.");
        }

        const newBlog = {
            id: new Date().toISOString() + Math.random().toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        };

        try {
            // Вставляем новый блог и получаем результат
            const result = await blogsCollection.insertOne(newBlog);

            // Получаем _id из результата и добавляем его к объекту newBlog
            const createdBlog = {
                ...newBlog,
                _id: result.insertedId.toString() // Преобразуем _id в строку
            };

            return createdBlog;
        } catch (error) {
            console.error('Error inserting new blog:', error);
            throw new Error('Failed to create blog');
        }
    },

    async find(id: string) {
        return await blogsCollection.findOne({ id: id }, { projection: { _id: 0 }})
    },

    async findAndMap(id: string) {
        const blogs = await this.find(id);// использовать этот метод если проверили существование
        return blogs ? this.map(blogs) : undefined
    },

    //Этот метод должен возвращать все блоги.
    async getAll(){
      return await blogsCollection.find({}, { projection: { _id: 0 } }).toArray();

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