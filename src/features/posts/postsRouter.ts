import {Router} from "express";
import {createPostController} from "./controllers/createPostController";
import {getPostsController} from "./controllers/getPostsController";
import {delPostController} from "./controllers/delPostController";
import {adminMiddleware} from "../../global_middlewares/admin-middleware";
import {findPostValidator, postValidators} from "./postValidators";
import {findPostController} from "./controllers/findPostController";
import {putPostController} from "./controllers/putPostController";
import {inputCheckErrorsMiddleware} from "../../global_middlewares/inputCheckErrorsMiddleware";

export const postsRouter = Router();

postsRouter.get('/', getPostsController)
postsRouter.post('/', ...postValidators, createPostController)
postsRouter.delete('/:id', adminMiddleware, inputCheckErrorsMiddleware, delPostController)
postsRouter.get('/:id', findPostValidator, findPostController)
postsRouter.put('/:id', findPostValidator, ...postValidators, putPostController)