import { createContext, useContext } from "react";
import { BoardColumn, TaskStatus } from "../types"

export type BoardContextValue = {
    columns: BoardColumn[];

    reorderColumn: (args: {
        startIndex: number;
        finishIndex: number;
    }) => void;

    reorderCard: (args: {
        columnId: TaskStatus;
        startIndex: number;
        finishIndex: number;
    }) => void;

    moveCard: (args: {
        taskId: string;
        fromColumnId: string;
        toColumnId: string;
        toIndex: number;
    }) => void;
};

export const BoardContext = createContext<BoardContextValue | null>(null);

export function useBoardContext() {
    const ctx = useContext(BoardContext);
    if (!ctx) {
        throw new Error("useBoardContext must be used within BoardContextProvider");
    }
    return ctx;
}
