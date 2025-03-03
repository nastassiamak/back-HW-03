import { Request, Response } from 'express'
import {PostInputModel, PostViewModel} from "../../../input-output-type/post_type";
import {postsRepository} from "../postsRepository";
import {HTTP_STATUSES} from "../../../db/db";


export const createPostController = async (req: Request<any,any, PostInputModel>,
                                     res: Response <PostViewModel>) => {

    const newPostId = await postsRepository.create(req.body)
    const newPost = await postsRepository.findAndMap(newPostId.id)

    res
        .status(HTTP_STATUSES.CREATED_201)
        .json(newPost)


}