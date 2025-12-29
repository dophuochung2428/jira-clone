"use client";

import { ReactNode, useEffect, useState } from "react";
import { BoardColumn, TaskStatus, TaskWithRelations } from "../types";
import { BoardContext } from "./board-context";

interface BoardContextProviderProps {
    children: ReactNode;
    data: TaskWithRelations[];
};

const boards: TaskStatus[] = [
    TaskStatus.BACKLOG,
    TaskStatus.TODO,
    TaskStatus.IN_PROGRESS,
    TaskStatus.IN_REVIEW,
    TaskStatus.DONE,
];

type TaskState = {
    [key in TaskStatus]: TaskWithRelations[];
};

export const BoardContextProvider = (
    { children, data }: BoardContextProviderProps
) => {
    const [columns, setColumns] = useState<BoardColumn[]>([]);

    useEffect(() => {
        const columnMap: TaskState = {
            [TaskStatus.BACKLOG]: [],
            [TaskStatus.TODO]: [],
            [TaskStatus.IN_PROGRESS]: [],
            [TaskStatus.IN_REVIEW]: [],
            [TaskStatus.DONE]: [],
        };

        data.forEach(task => {
            columnMap[task.status].push(task);
        });

        const newColumns: BoardColumn[] = boards.map(status => ({
            id: status,
            tasks: columnMap[status],
        }));

        setColumns(newColumns);
    }, [data]);

    const reorderColumn = ({
        startIndex,
        finishIndex,
    }: {
        startIndex: number;
        finishIndex: number;
    }) => {
        setColumns((prev) => {
            const next = [...prev];

            const [moved] = next.splice(startIndex, 1);

            next.splice(finishIndex, 0, moved);
            return next;
        });
    };

    return (
        <BoardContext.Provider value={{ columns, reorderColumn }}>
            {children}
        </BoardContext.Provider>
    )
}