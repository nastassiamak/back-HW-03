import {PostInputModel, PostViewModel} from "../../input-output-type/post_type";
import {PostDBType} from "../../db/post-db-type";
import {blogsRepository} from "../blogs/blogsRepository";
import {db} from "../../db/db";
import {blogsCollection, postsCollection} from "../../db/mongoDb";
import {ObjectId} from "mongodb";
import {BlogInputModel} from "../../input-output-type/blog_type";
import {BlogBbType} from "../../db/blog-db-type";

export const postsRepository = {
    async create(post: PostInputModel) {
        const blog = await blogsRepository.find(post.blogId);
        const blogName = blog ? blog.name : "Неизвестный блог"; // Поверяем и устанавливаем значение по умолчанию
        const newPost  = {
            id: new Date().toISOString() + Math.random().toString(),
            title: post.title,
            content: post.content,
            shortDescription: post.shortDescription,
            blogId: post.blogId,
            blogName: blogName,
            createdAt:new Date().toISOString(),
        }
        try {


        const res = await postsCollection.insertOne(newPost);

        const createdPost: PostDBType = {
            id: newPost.id,
            title: newPost.title,
            content: newPost.content,
            shortDescription: newPost.shortDescription,
            blogId: newPost.blogId,
            blogName: newPost.blogName,
            createdAt: newPost.createdAt,
        }
            return createdPost; // Возвращаем созданный блог
        } catch (error) {
            console.error('Error inserting new blog:', error);
            throw new Error('Failed to create blog');
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