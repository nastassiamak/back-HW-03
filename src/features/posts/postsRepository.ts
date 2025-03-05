import {PostInputModel, PostViewModel} from "../../input-output-type/post_type";
import {PostDBType} from "../../db/post-db-type";
import {blogsRepository} from "../blogs/blogsRepository";
import {db} from "../../db/db";
import {blogsCollection, postsCollection} from "../../db/mongoDb";
import {ObjectId} from "mongodb";
import {BlogInputModel} from "../../input-output-type/blog_type";
import {BlogBbType} from "../../db/blog-db-type";

export const postsRepository = {
    async create(post: PostInputModel):Promise<PostDBType> {
        const blog = await blogsRepository.find(post.blogId);
        const blogName = blog ? blog.name : "Неизвестный блог"; // Поверяем и устанавливаем значение по умолчанию
        const newPost: PostDBType  = {
            id: new Date().toString() + Math.random(),
            title: post.title,
            content: post.content,
            shortDescription: post.shortDescription,
            blogId: post.blogId,
            blogName: blogName,
            createdAt:new Date().toString(),
        }
        const res = await postsCollection.insertOne(newPost);
        return newPost
        // db.posts = [...db.posts, newPost]
        // return newPost.id
    },

    async find(id: string) {
        return await postsCollection.findOne({id})
    },

    async findByUUID(_id: ObjectId) {
        return await postsCollection.findOne({_id})
    },

    async findAndMap(id: string) {
        const post = await this.find(id);// использовать этот метод если проверили существование
        return post ? this.map(post) : undefined
    },

    async getAll(){
        return await postsCollection.find({}).toArray();
    },

    async del(id: string) {
        const result = await postsCollection.deleteOne({id})
        return result.deletedCount ? {id}: null
    },

    async put(post: PostInputModel, id: string) {
        const blog = await blogsRepository.find(post.blogId);
        if (!blog) {
            return null;
        }
        const result = await postsCollection.updateOne({id}, {$set: post });
        return result.modifiedCount ? {id}: null
    },

    map(post: PostDBType) {
        const postForOutput: PostViewModel = {
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
        }
        return postForOutput
    },
}