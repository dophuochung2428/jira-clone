"use client";

import { Fragment, useEffect } from "react";
import { useBoardContext } from "./board-context";
import { Column } from "./column";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { ColumnGap } from "./column-gap";

type ColumnDragData = {
    type: "COLUMN";
    index: number;
};
type ColumnGapDropData = {
    type: "COLUMN_GAP";
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

                const targetData = target.data as ColumnGapDropData

                reorderColumn({
                    startIndex: sourceData.index,
                    finishIndex: targetData.index,
                });
            },
        });
    }, [reorderColumn]);


    return (
        <div className="flex flex-row gap-x-2 h-[480px]">
            {columns.map((column, index) => (
                <Fragment key={column.id}>
                    <ColumnGap index={index} />

                    <Column column={column} index={index} />
                </Fragment>
            ))}
            <ColumnGap index={columns.length} />
        </div>
    );
}