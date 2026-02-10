"use client";

import { Fragment, useEffect, useState } from "react";
import { useBoardContext } from "./board-context";
import { Column } from "./column";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

import {
    extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";

import {
    getReorderDestinationIndex,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index";

import { DropIndicator } from
    "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box";


export type ColumnDragData = {
    type: "COLUMN";
    index: number;
};

export default function Board() {
    const { columns, reorderColumn } = useBoardContext();

    useEffect(() => {
        return monitorForElements({
            onDrop({ source, location }) {
                const sourceData = source.data as ColumnDragData;
                if (sourceData.type !== "COLUMN") return;

                const target = location.current.dropTargets[0];
                if (!target) return;

                const targetData = target.data as ColumnDragData;

                const edge = extractClosestEdge(targetData);

                console.log(edge);

                let destinationIndex = getReorderDestinationIndex({
                    startIndex: sourceData.index,
                    indexOfTarget: targetData.index,
                    closestEdgeOfTarget: edge,
                    axis: "horizontal",
                });

                reorderColumn({
                    startIndex: sourceData.index,
                    finishIndex: destinationIndex,
                });
            },
        });
    }, [reorderColumn]);


    return (
        <div className="flex flex-row h-[480px]">
            {columns.map((column, index) => (
                <Column key={column.id} column={column} index={index} />
            ))}
        </div>
    );
}