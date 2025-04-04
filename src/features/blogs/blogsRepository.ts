import { BlogInputModel,BlogViewModel } from "../../input-output-type/blog_type";
import { blogsCollection } from "../../db/mongoDb"; // Подключите к своей коллекции
import { ObjectId, OptionalId } from "mongodb";
import {BlogBbType} from "../../db/blog-db-type";

export const blogsRepository = {
    async create(blog: BlogInputModel){
        if (!blogsCollection) {
            throw new Error("blogsCollection не инициализирована.");
        }

        // Генерация объекта нового блога с id
        const newBlog: BlogBbType ={
            id: new ObjectId().toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: new Date().toISOString(), // Генерация текущего времени в формате ISO
            isMembership: false // Используем значение из blog или false по умолчанию
    };

    try {
        // Вставляем новый блог в коллекцию
        const result = await blogsCollection.insertOne(newBlog);

        // Создаем объект блога, включая только _id от MongoDB
        const createdBlog: BlogBbType = {
    id: newBlog.id,

    name: newBlog.name,
    description: newBlog.description,
    websiteUrl: newBlog.websiteUrl,
    createdAt: newBlog.createdAt,
    isMembership: newBlog.isMembership
};

return createdBlog; // Возвращаем созданный блог
} catch (error) {
    console.error('Error inserting new blog:', error);
    throw new Error('Failed to create blog');
}
},

    async find(id: string): Promise<BlogBbType | null> {
        // Поиск по _id (используем ObjectId)
        const blog = await blogsCollection.findOne({id: id}, {projection: {_id: 0}});
        return blog ? { ...blog, id: blog.id} : null; // Возвращаем объект с id
    },

    async findAndMap(id: string): Promise<BlogViewModel | undefined> {
        const blog = await this.find(id);
        return blog ? this.map(blog) : undefined; // Возвращаем отображаемую модель
    },

    async getAll(): Promise<BlogBbType[]> {
        const blogs = await blogsCollection.find({}, {projection: {_id: 0}}).toArray();
        return blogs.map(blog => ({ ...blog, id: blog.id })); // Обновляем все блоги с id
    },

    async del(id: string): Promise<{ id: string } | null> {
        const result = await blogsCollection.deleteOne({ id: id});
        return result.deletedCount ? { id } : null; // Возвращаем id удаленного блога
    },

    async put(blog: BlogInputModel, id: string): Promise<{ id: string } | null> {
        const result = await blogsCollection.updateOne({ id:id }, { $set: blog });
        return result.modifiedCount ? { id } : null; // Возвращаем id обновленного блога
    },

    map(blog: BlogBbType): BlogViewModel {
        return {
            id: blog.id,
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership,
        };
    }
}
