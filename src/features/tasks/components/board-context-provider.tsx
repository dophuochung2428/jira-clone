"use client";

import { ReactNode, useEffect, useState } from "react";
import { BoardColumn, TaskStatus, TaskWithRelations } from "../types";
import { BoardContext } from "./board-context";
import { useBuldUpdateTasks } from "../api/use-bulk-update-tasks";

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

type TaskUpdatePayload = {
    $id: string;
    status: TaskStatus;
    position: number;
};

export const BoardContextProvider = (
    { children, data }: BoardContextProviderProps
) => {
    const [columns, setColumns] = useState<BoardColumn[]>([]);
    const bulkUpdate = useBuldUpdateTasks();

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

    const reorderCard = ({
        columnId,
        startIndex,
        finishIndex,
    }: {
        columnId: TaskStatus;
        startIndex: number;
        finishIndex: number;
    }) => {
        if (startIndex === finishIndex) return;

        let updates: TaskUpdatePayload[] = [];

        setColumns((prev) =>
            prev.map((column) => {
                if (column.id !== columnId) return column;

                const nextTasks = [...column.tasks];
                const [moved] = nextTasks.splice(startIndex, 1);
                nextTasks.splice(finishIndex, 0, moved);

                updates = nextTasks.map((task, index) => ({
                    $id: task.$id,
                    status: columnId,
                    position: (index + 1) * 1000,
                }));

                return {
                    ...column,
                    tasks: nextTasks,
                };
            })
        );

        bulkUpdate.mutate({
            json: {
                tasks: updates,
            },
        });
    };

    const moveCard = ({
        taskId,
        fromColumnId,
        toColumnId,
        toIndex,
    }: {
        taskId: string;
        fromColumnId: string;
        toColumnId: string;
        toIndex: number;
    }) => {
        let updates: TaskUpdatePayload[] = [];

        setColumns((prev) => {
            let movedTask: TaskWithRelations | null = null;

            const withoutTask = prev.map((column) => {
                if (column.id !== fromColumnId) return column;

                const remainingTasks = column.tasks.filter((task) => {
                    if (task.$id === taskId) {
                        movedTask = task;
                        return false;
                    }
                    return true;
                });

                remainingTasks.forEach((task, index) => {
                    updates.push({
                        $id: task.$id,
                        status: fromColumnId,
                        position: (index + 1) * 1000,
                    });
                });

                return {
                    ...column,
                    tasks: remainingTasks,
                };
            });

            if (!movedTask) return prev;

            return withoutTask.map((column) => {
                if (column.id !== toColumnId) return column;

                const nextTasks = [...column.tasks];
                nextTasks.splice(toIndex, 0, {
                    ...movedTask!,
                    status: toColumnId,
                });

                nextTasks.forEach((task, index) => {
                    updates.push({
                        $id: task.$id,
                        status: toColumnId,
                        position: (index + 1) * 1000,
                    });
                });

                return {
                    ...column,
                    tasks: nextTasks,
                };
            });
        });

        bulkUpdate.mutate({
            json: {
                tasks: updates,
            },
        });

    };

    return (
        <BoardContext.Provider value={{ columns, reorderColumn, reorderCard, moveCard }}>
            {children}
        </BoardContext.Provider>
    )
}