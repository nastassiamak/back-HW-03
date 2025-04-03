import {PostInputModel, PostViewModel} from "../../input-output-type/post_type";
import {PostDBType} from "../../db/post-db-type";
import {blogsRepository} from "../blogs/blogsRepository";
import {postsCollection} from "../../db/mongoDb";
import {ObjectId} from "mongodb";

export const postsRepository = {
    async create(post: PostInputModel): Promise<PostDBType> {
        // Сначала находим блог, чтобы получить его название
        const blog = await blogsRepository.find(post.blogId);
        const blogName = blog ? blog.name : "Неизвестный блог"; // Устанавливаем имя блога

        // Создаем новый пост с необходимыми полями
        const newPost: PostDBType= {
            id: new Date().toISOString() + Math.random().toString(), // Генерация уникального идентификатора
            title: post.title,
            content: post.content,
            shortDescription: post.shortDescription,
            blogId: post.blogId,
            blogName: blogName, // Здесь сохраняем название блога
            createdAt: new Date().toISOString(), // Сохраняем текущую дату в правильном формате
        };

        // Пытаемся вставить новый пост в коллекцию
        try {
            await postsCollection.insertOne(newPost); // Вставка в коллекцию

            return {
                id: newPost.id,
                title: newPost.title,
                content: newPost.content,
                shortDescription: newPost.shortDescription,
                blogId: newPost.blogId,
                blogName: newPost.blogName,
                createdAt: newPost.createdAt, // Сохраняем дату создания
            }; // Возвращаем созданный пост
        } catch (error) {
            console.error('Error inserting new post:', error);
            throw new Error('Failed to create post'); // Обработка ошибок
        }
    },


    async find(id: string): Promise<PostDBType | null> {
        const post = await postsCollection.findOne({id: id}, {projection: {_id: 0}});
        return post ? {...post, id: post.id} : null
    },

    async findByUUID(_id: ObjectId) {
        return await postsCollection.findOne({_id})
    },

    async findAndMap(id: string) {
        const post = await this.find(id);// использовать этот метод если проверили существование
        return post ? this.map(post) : undefined
    },

    async getAll(): Promise<PostDBType[]> {
        const posts = await postsCollection.find({}, {projection: {_id: 0}}).toArray();
        return posts.map(post => ({ ...post, id: post.id }));
    },

    async del(id: string): Promise<{id: string} | null> {
        const result = await postsCollection.deleteOne({id})
        return result.deletedCount ? {id}: null
    },

    async put(post: PostInputModel, id: string):Promise<{ id: string } | null> {
        const blog = await blogsRepository.find(post.blogId);
        if (!blog) {
            return null;
        }
        const result = await postsCollection.updateOne({id: id}, {$set: post });
        return result.modifiedCount ? {id}: null
    },

    map(post: PostDBType): PostViewModel {
        return  {
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
        }

    },
}