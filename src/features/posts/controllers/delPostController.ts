import {Request, Response} from "express";
import {postsRepository} from "../postsRepository";
import {HTTP_STATUSES} from "../../../db/db";
import {blogsRepository} from "../../blogs/blogsRepository";

export const delPostController = async (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;

    const postFind = await postsRepository.find(id);
    if (!postFind) {
        res.status(HTTP_STATUSES.NOT_FOUND_404).send({ error: "Post not found" });
    }

   const postId = await postsRepository.del(id);
    if (postId) {
        res
            .sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    }
};