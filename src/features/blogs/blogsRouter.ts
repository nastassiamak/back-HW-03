import {Router} from "express";
import {getBlogsController} from "./controllers/getBlogsController";
import {findBlogController} from "./controllers/findBlogController";
import {delBlogController} from "./controllers/delBlogController";
import {putBlogController} from "./controllers/putBlogController";
import {createBlogController} from "./controllers/createBlogController";
import {blogValidators, findBlogValidator} from "./blogValidators";
import {adminMiddleware} from "../../global_middlewares/admin-middleware";


export const blogsRouter = Router()

blogsRouter.post('/', ...blogValidators, createBlogController)
blogsRouter.get('/', getBlogsController)
blogsRouter.get('/:id', findBlogValidator, findBlogController)
blogsRouter.delete('/:id', adminMiddleware, findBlogValidator, delBlogController)
blogsRouter.put('/:id', findBlogValidator, ...blogValidators, putBlogController)
