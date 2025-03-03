"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRepository = void 0;
const blogsRepository_1 = require("../blogs/blogsRepository");
const db_1 = require("../../db/db");
exports.postsRepository = {
    create(post) {
        const newPost = {
            id: new Date().toString() + Math.random(),
            title: post.title,
            content: post.content,
            shortDescription: post.shortDescription,
            blogId: post.blogId,
            blogName: blogsRepository_1.blogsRepository.find(post.blogId).name,
        };
        db_1.db.posts = [...db_1.db.posts, newPost];
        return newPost.id;
    },
    find(id) {
        return db_1.db.posts.find(p => p.id === id);
    },
    findAndMap(id) {
        const post = this.find(id);
        return this.map(post);
    },
    getAll() {
        return db_1.db.posts.map(p => this.map(p));
    },
    del(id) {
        const index = db_1.db.posts.findIndex(b => b.id === id);
        if (index > -1) {
            db_1.db.posts.splice(index, 1);
        }
    },
    put(post, id) {
        const blog = blogsRepository_1.blogsRepository.find(post.blogId);
        return db_1.db.posts = db_1.db.posts.map(p => p.id === id ? Object.assign(Object.assign(Object.assign({}, p), post), { blogName: blog.name }) : p);
    },
    map(post) {
        const postForOutput = {
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
        };
        return postForOutput;
    },
};
