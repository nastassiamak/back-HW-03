import { Request, Response } from "express";
import {BlogViewModel} from "../../../input-output-type/blog_type";
import {db, HTTP_STATUSES} from "../../../db/db";
import {blogsRepository} from "../blogsRepository";
import {ObjectId} from "mongodb";

export  const findBlogController = async (req: Request<{id: string}>,
                                    res: Response <BlogViewModel>) => {
    const {id} = req.params;

    const blog: BlogViewModel | null = await blogsRepository.find(id)

     if (!blog) {
        res
             .sendStatus(HTTP_STATUSES.NOT_FOUND_404);
     } else {
         res.status(HTTP_STATUSES.OK_200).send(blog);
     }

}