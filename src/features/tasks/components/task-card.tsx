import { useEffect, useRef } from "react";
import { TaskWithRelations } from "../types";
import { useColumnContext } from "./column-context";
import { draggable, dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { attachClosestEdge, extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { useBoardContext } from "./board-context";
import { TaskActions } from "./task-actions";
import { MoreHorizontal } from "lucide-react";
import { DottedSeparator } from "@/components/dotted-separator";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { TaskDate } from "./task-date";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";

interface TaskCardProps {
    task: TaskWithRelations;
};

export type CardDragData = {
    type: "CARD";
    taskId: string;
    fromColumnId: string;
    index: number;
};


export const TaskCard = ({ task }: TaskCardProps) => {
    const { columnId, getCardIndex } = useColumnContext();
    const { reorderCard, moveCard } = useBoardContext();
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        const cleanupDraggable = draggable({
            element: ref.current,
            getInitialData: () => ({
                type: "CARD",
                taskId: task.$id,
                fromColumnId: columnId,
                index: getCardIndex(task.$id),
            }),
        });

        const cleanUpDrop = dropTargetForElements({
            element: ref.current,
            canDrop: ({ source }) => source.data.type === "CARD",
            getData: ({ input, element }) =>
                attachClosestEdge(
                    { taskId: task.$id },
                    {
                        input,
                        element,
                        allowedEdges: ["top", "bottom"],
                    }
                ),

            onDrop: ({ source, self }) => {
                const sourceData = source.data as CardDragData;

                const sourceIndex = sourceData.index;
                const targetIndex = getCardIndex(task.$id);
                const edge = extractClosestEdge(self.data);

                let toIndex = targetIndex;
                if (edge === "bottom") {
                    toIndex += 1;
                }

                if (source.data.fromColumnId === columnId) {
                    if (sourceIndex < targetIndex) {
                        toIndex -= 1;
                    }

                    reorderCard({
                        columnId,
                        startIndex: sourceIndex,
                        finishIndex: toIndex,
                    });
                } else {
                    moveCard({
                        taskId: sourceData.taskId,
                        fromColumnId: sourceData.fromColumnId,
                        toColumnId: columnId,
                        toIndex,
                    });
                }
            },
        });
        return () => {
            cleanupDraggable();
            cleanUpDrop();
        };
    }, [task.$id, columnId, getCardIndex, reorderCard, moveCard]);


    return (
        <div ref={ref} className="bg-white p-2 rounded shadow space-y-3">
            <div className="flex items-start justify-between gap-x-2">
                <p className="text-sm font-medium">{task.name}</p>
                <TaskActions id={task.$id} projectId={task.projectId}>
                    <MoreHorizontal className="size-[18px] stroke-1 shrink-0 text-neutral-700 hover:opacity-75 transition" />
                </TaskActions>
            </div>
            <DottedSeparator />
            <div className="flex items-center gap-x-1.5">
                <MemberAvatar
                    name={task.assignee?.name ?? "Unknown"}
                    fallbackClassName="text-[10px]"
                />
                <div className="size-1 rounded-full bg-neutral-300" />
                <TaskDate value={task.dueDate ?? ""} className="text-xs" />
            </div>
            <div className="flex items-center gap-x-1.5">
                <ProjectAvatar
                    name={task.project?.name ?? "No project"}
                    image={task.project?.imageUrl}
                    fallbackClassname="text-[10px]"
                />
                <span className="text-xs font-medium">{task.project?.name ?? "No project"}</span>
            </div>
        </div>
    )
}