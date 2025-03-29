import {ObjectId} from "mongodb";

export type PostViewModel = {

    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt?: string;
}

export type PostInputModel = {
    //_id?: ObjectId;
    title: string; //maxLength: 30
    shortDescription: string; //maxLength: 100
    content: string; //maxLength: 1000
    blogId: string;

}



