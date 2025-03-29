

//готовые данные для преиспользования в тестах

import {BlogBbType} from "../../src/db/blog-db-type";
import {DBType} from "../../src/db/db";
import {SETTINGS} from "../../src/setting";
import {fromUTF8ToBase64} from "../../src/global_middlewares/admin-middleware";
import {PostDBType} from "../../src/db/post-db-type";
import {ObjectId} from "mongodb";


export const codedAuth = fromUTF8ToBase64(SETTINGS.ADMIN)

export const createString = (length: number) => {
    let s =''
    for (let i = 1; i <= length; i++) {
        s += i % 10
    }
    return s;
}


export const blog1: BlogBbType = {
    id: new Date().toISOString() + Math.random(),

    name: 'n11',
    description: 'd11',
    websiteUrl: 'http://example11.com',
    createdAt: new Date().toISOString(),
    isMembership: false
} as const // dataset нельзя изменять

export const blog5: BlogBbType = {
    id: new Date().toISOString() + Math.random(),

    name: 'name5',
    description: 'description5',
    websiteUrl: 'http://example5.com',
    createdAt: new Date().toISOString(),
    isMembership: false
} as const // dataset нельзя изменять

export const blog6: BlogBbType = {
    id: new Date().toISOString() + Math.random(),

    name: 'name6',
    description: 'description6',
    websiteUrl: 'http://example6.com',
    createdAt: new Date().toISOString(),
    isMembership: false
} as const // dataset нельзя изменять

export const post1: PostDBType ={
   id: new Date().toISOString() + Math.random(),
    title: 't1',
    shortDescription: 's1',
    content: 'c1',
    blogId: blog1.id,
    blogName: 'n1',
    createdAt: new Date().toISOString()

}
export const post2: PostDBType ={
    id: new Date().toISOString() + Math.random(),
    title: 't2',
    shortDescription: 's2',
    content: 'c2',
    blogId: blog5.id,
    blogName: 'name5',
    createdAt: new Date().toISOString()

}


export const dataset1: DBType = {
    blogs: [blog1],
    posts:[]
}

export const dataset2: DBType = {
    blogs: [blog1 , blog5, blog6],
    posts: [post1, post2]
} as const //dataset нельзя изменять
