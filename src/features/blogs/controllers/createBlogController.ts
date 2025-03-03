import {Request, Response} from "express";
import {BlogViewModel, BlogInputModel} from "../../../input-output-type/blog_type";
import {db, HTTP_STATUSES} from "../../../db/db";
import {blogsRepository} from "../blogsRepository";


export const createBlogController = async (req: Request<any, any, BlogInputModel>,
                                    res:Response<BlogViewModel>) =>{
    const newBlogId = await blogsRepository.create(req.body)

    const newBlog = await blogsRepository.findAndMap(newBlogId.id)

    res
        .status(HTTP_STATUSES.CREATED_201)
        .json(newBlog)
}