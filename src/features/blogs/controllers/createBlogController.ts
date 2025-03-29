import {Request, Response} from "express";
import {BlogViewModel, BlogInputModel} from "../../../input-output-type/blog_type";
import {db, HTTP_STATUSES} from "../../../db/db";
import {blogsRepository} from "../blogsRepository";
import {BlogBbType} from "../../../db/blog-db-type";

export const createBlogController = async (req: Request<any, any, BlogBbType>,
                                     res:Response<BlogViewModel>) =>{
        const newBlogId = await blogsRepository.create(req.body)

        if(!newBlogId){
                res
                    .status(HTTP_STATUSES.BAD_REQUEST_400)
        } else {
                const newBlog = await blogsRepository.findAndMap(newBlogId.id)

                res
                    .status(HTTP_STATUSES.CREATED_201)
                    .json(newBlog)
        }
}