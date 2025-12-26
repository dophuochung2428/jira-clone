"use client";

import { useEffect, useRef } from "react";
import { BoardColumn } from "../types";
import { TaskCard } from "./task-card";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

interface ColumnProps {
    column: BoardColumn;
    index: number;
};

export const Column = ({ column, index }: ColumnProps) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        const cleanupDraggable = draggable({
            element: ref.current,
            getInitialData: () => ({
                type: "COLUMN",
                index,
            }),
        });

        return () => {
            cleanupDraggable();
        };
    }, [index]);

    return (
        <div
            className="flex flex-col bg-gray-100 rounded-lg p-2 w-64"
            ref={ref}
        >
            <h2 className="font-bold mb-2">
                {column.id}
            </h2>
            <div className="flex flex-col gap-2">
                {column.tasks.map((task) => (
                    <TaskCard key={task.$id} task={task} />
                ))}
            </div>
        </div>
    );
};