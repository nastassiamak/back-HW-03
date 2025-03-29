import {ObjectId} from "mongodb";

export type BlogBbType = {
    _id: ObjectId;
    id?: string;
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: string;
    isMembership: boolean;
}
