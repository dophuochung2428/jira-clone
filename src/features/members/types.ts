import { Models } from "node-appwrite";

export enum MemberRole {
    ADMIN = "ADMIN",
    MEMBER = "MEMBER"
};

export type Assignee = Models.Document & {
    name: string;
    email: string;
}