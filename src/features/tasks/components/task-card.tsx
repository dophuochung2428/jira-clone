import { TaskWithRelations } from "../types";

interface TaskCardProps {
    task: TaskWithRelations;
};

export const TaskCard = ({ task }: TaskCardProps) => {
    return (
        <div className="bg-white p-2 rounded shadow">
            <p className="text-sm font-medium">{task.name}</p>
        </div>
    )
}