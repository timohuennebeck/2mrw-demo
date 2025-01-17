import { Circle, CircleCheck } from "lucide-react";

interface TaskStatusProps {
    isCompleted: boolean;
}

export const TaskStatus = ({ isCompleted }: TaskStatusProps) => {
    return (
        <div className="flex h-5 w-5 items-start pt-0.5">
            {isCompleted ? (
                <CircleCheck className="h-4 w-4 fill-blue-600 stroke-white text-blue-600" />
            ) : (
                <Circle className="h-4 w-4 text-gray-300" />
            )}
        </div>
    );
};
