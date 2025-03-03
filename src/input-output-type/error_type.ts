import {BlogInputModel} from "./blog_type";
import {PostInputModel} from "./post_type";

export type FieldNamesType = keyof BlogInputModel | keyof PostInputModel

export type OutputErrorsType = {
    errorsMessages: {message: string, field: FieldNamesType}[]
}

