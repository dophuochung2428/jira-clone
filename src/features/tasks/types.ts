import { Models } from "node-appwrite";
import { Project } from "../projects/types";
import { Assignee } from "../members/types";

export enum TaskStatus {
    BACKLOG = "BACKLOG",
    TODO = "TODO",
    IN_PROGRESS = "IN_PROGRESS",
    IN_REVIEW = "IN_REVIEW",
    DONE = "DONE"
}

export type Task = Models.Document & {
    name: string;
    status: TaskStatus;
    workspaceId: string;
    assigneeId: string;
    projectId: string;
    position: number;
    dueDate?: string;
    description?: string;
};

export type TaskWithRelations = Task & {
    project?: Project | undefined;
    assignee?: Assignee | undefined;
};