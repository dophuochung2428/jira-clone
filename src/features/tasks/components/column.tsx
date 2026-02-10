"use client";

import { useEffect, useRef, useState } from "react";
import { BoardColumn } from "../types";
import { CardDragData, TaskCard } from "./task-card";
import { draggable, dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

import {
    attachClosestEdge,
    Edge,
    extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";

import { DropIndicator } from
    "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box";
import { ColumnContext } from "./column-context";
import { ColumnDragData } from "./board";
import { useBoardContext } from "./board-context";

import { useVirtualizer } from "@tanstack/react-virtual";
import { KanbanColumnHeader } from "./kanban-column-header";

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
    const scrollRef = useRef<HTMLDivElement>(null);

    const rowVirtualizer = useVirtualizer({
        count: column.tasks.length,
        getScrollElement: () => scrollRef.current,
        estimateSize: () => 135,
    })

    const { moveCard } = useBoardContext();
    const ref = useRef<HTMLDivElement>(null);
    const [state, setState] = useState<ColumnState>(idle);
    const getCardIndex = (taskId: string) =>
        column.tasks.findIndex((t) => t.$id === taskId);

    const getNumCards = () => column.tasks.length;

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
            canDrop: ({ source }) =>
                source.data.type === "COLUMN" || source.data.type === "CARD",

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

            onDragEnter: ({ source, self }) => {
                if (source.data.type !== "COLUMN") return;

                setState({
                    type: "is-column-over",
                    closestEdge: extractClosestEdge(self.data),
                });
            },

            onDrag: ({ source, self }) => {
                if (source.data.type !== "COLUMN") return;

                const edge = extractClosestEdge(self.data);
                setState((prev) =>
                    prev.type === "is-column-over" &&
                        prev.closestEdge === edge
                        ? prev
                        : { type: "is-column-over", closestEdge: edge }
                );
            },

            onDragLeave: () => setState(idle),
            onDrop: ({ source }) => {
                setState(idle);

                if (source.data.type === "CARD") {
                    const card = source.data as CardDragData;

                    moveCard({
                        taskId: card.taskId,
                        fromColumnId: card.fromColumnId,
                        toColumnId: column.id,
                        toIndex: column.tasks.length,
                    });
                }
            },
        });
        return () => {
            cleanupDraggable();
            cleanupDrop();
        };
    }, [index, column, moveCard]);


    return (
        <div className="px-1 relative rounded-lg w-64 h-full" ref={ref}>
            <div
                className="flex flex-col bg-gray-100 rounded-lg p-2 h-full"

            >
                {state.type === "is-column-over" && state.closestEdge && (
                    <DropIndicator edge={state.closestEdge} />
                )}
                <KanbanColumnHeader
                    board={column.id}
                    taskCount={column.tasks.length}
                />
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto pr-1"
                >

                    <ColumnContext.Provider
                        value={{
                            columnId: column.id,
                            getCardIndex,
                            getNumCards,
                        }}
                    >
                        <div
                            style={{
                                height: rowVirtualizer.getTotalSize(),
                                position: "relative",
                            }}
                        >
                            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                                const task = column.tasks[virtualRow.index];

                                return (
                                    <div
                                        key={task.$id}
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            width: "100%",
                                            transform: `translateY(${virtualRow.start}px)`,
                                        }}
                                    >
                                        <TaskCard task={task} />
                                    </div>
                                );
                            })}
                        </div>
                    </ColumnContext.Provider>
                </div>
            </div>
        </div>
    );
};