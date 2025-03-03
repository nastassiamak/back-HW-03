import {BlogBbType} from "./blog-db-type";
import {PostDBType} from "./post-db-type";

export const HTTP_STATUSES = {
    NOT_FOUND_404: 404,
    UNAUTHORIZED_401: 401,
    BAD_REQUEST_400: 400,

    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204
}
export const db: DBType = {
    blogs:[],
    posts:[]
}
export type DBType = {
    blogs: BlogBbType[],
    posts: PostDBType[]
}

export type ReadonlyDBType = { // тип для dataset
    blogs: Readonly<BlogBbType[]>,
    posts: Readonly<PostDBType[]>

}


// функция для быстрой очистки/заполнения бд для тестов
export const setDB = (dataset?: Partial<ReadonlyDBType> ) => {
    if (!dataset) {//если в функцию ничего не передано - то очищаем бд
        db.blogs = []
        db.posts = []
        return
    }

    //если что-то передано - то заменяем старые значения новыми,
    //не ссылки - а глубокое копирование, чтобы не изменять dataset
    db.blogs = dataset.blogs?.map(b => ({...b})) || db.blogs
    db.posts = dataset.posts?.map(p => ({...p})) || db.posts

}