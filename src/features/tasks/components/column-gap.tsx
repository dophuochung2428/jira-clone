import { cn } from "@/lib/utils";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

import { useEffect, useRef, useState } from "react"

export const ColumnGap = ({ index }: { index: number }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (!ref.current) return;

        return dropTargetForElements({
            element: ref.current,
            canDrop: ({ source }) =>
                source.data?.type === "COLUMN",

            getIsSticky: () => true,

            onDragEnter: () => setIsActive(true),
            onDragLeave: () => setIsActive(false),
            onDrop: () => setIsActive(false),

            getData: () => ({
                type: "COLUMN_GAP",
                index,
            }),
        });
    }, [index]);

    return (
        <div
            ref={ref}
            className={cn(
                "w-2 h-full transition-colors",
                isActive ? "bg-blue-400" : "bg-transparent"
            )}
        />
    )
};