import { TaskWithRelations } from "../types";
import Board from "./board";
import { BoardContextProvider } from "./board-context-provider";

interface DataKanbanProps {
    data: TaskWithRelations[];
};

export const DataKanbanPramatic = ({ data }: DataKanbanProps) => {
    return (
        <BoardContextProvider data={data}>
            <Board />
        </BoardContextProvider>

    );
};