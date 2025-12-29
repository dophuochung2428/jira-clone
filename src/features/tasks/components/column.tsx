"use client";

import { useEffect, useRef, useState } from "react";
import { BoardColumn } from "../types";
import { TaskCard } from "./task-card";
import { draggable, dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

import {
    attachClosestEdge,
    Edge,
    extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";

import { DropIndicator } from
    "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box";

type ColumnState =
    | { type: "idle" }
    | { type: "is-column-over"; closestEdge: Edge | null };

const idle: ColumnState = { type: "idle" };

interface ColumnProps {
    column: BoardColumn;
    index: number;
    dropIndicatorEdge?: "left" | "right";
}

export const Column = ({ column, index, dropIndicatorEdge }: ColumnProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [state, setState] = useState<ColumnState>(idle);

    useEffect(() => {
        if (!ref.current) return;

        const cleanupDraggable = draggable({
            element: ref.current,
            getInitialData: () => ({
                type: "COLUMN",
                index,
            }),
        });

        const cleanupDrop = dropTargetForElements({
            element: ref.current,
            canDrop: ({ source }) => source.data.type === "COLUMN",
            getIsSticky: () => true,
            getData: ({ input, element }) =>
                attachClosestEdge(
                    { type: "COLUMN", index },
                    {
                        input,
                        element,
                        allowedEdges: ["left", "right"],
                    }
                ),

            onDragEnter: (args) => {
                setState({
                    type: "is-column-over",
                    closestEdge: extractClosestEdge(args.self.data),
                });
            },

            onDrag: (args) => {
                const edge = extractClosestEdge(args.self.data);
                setState((prev) =>
                    prev.type === "is-column-over" &&
                        prev.closestEdge === edge
                        ? prev
                        : { type: "is-column-over", closestEdge: edge }
                );
            },

            onDragLeave: () => setState(idle),
            onDrop: () => setState(idle),
        });
        return () => {
            cleanupDraggable();
            cleanupDrop();
        };
    }, [index]);


    return (
        <div
            className="relative flex flex-col bg-gray-100 rounded-lg p-2 w-64"
            ref={ref}
        >
            {state.type === "is-column-over" && state.closestEdge && (
                <DropIndicator edge={state.closestEdge} />
            )}
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