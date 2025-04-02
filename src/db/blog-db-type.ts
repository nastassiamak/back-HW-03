import {ObjectId} from "mongodb";

export type BlogBbType = {

    id: string;

    name: string;
    description: string;
    websiteUrl: string;
    createdAt: string;
    isMembership: boolean;
}
