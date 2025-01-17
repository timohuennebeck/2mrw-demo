import { CompletionCheckField } from "@/config/onboarding.config";
import { cn } from "@/lib/utils";
import { TaskContent } from "./task-content";
import { TaskHeader } from "./task-header";
import { TaskStatus } from "./task-status";

interface TaskItemProps {
    id: string;
    title: string;
    description: string;
    isCompleted: boolean;
    disabled?: boolean;
    reward: {
        amount: number;
        unit: string;
    };
    action: {
        href: string;
        label: string;
    };
    referralSteps?: number;
    completionCheck?: {
        field: string;
    };
    isOpen: boolean;
    onToggle: () => void;
    userProgress: { [key in CompletionCheckField]: number };
}

export const TaskItem = ({
    title,
    description,
    isCompleted,
    disabled,
    reward,
    action,
    referralSteps,
    completionCheck,
    isOpen,
    onToggle,
    userProgress,
}: TaskItemProps) => {
    return (
        <div className="relative">
            <div
                className={cn(
                    "relative cursor-pointer rounded-lg p-3 transition-colors hover:bg-gray-50/75",
                    disabled && "opacity-50",
                    isCompleted && "opacity-50 hover:opacity-75",
                    isOpen && "bg-gray-50",
                )}
                onClick={onToggle}
            >
                <div className="flex gap-3">
                    <TaskStatus isCompleted={isCompleted} />
                    <div className="min-w-0 flex-grow">
                        <TaskHeader
                            title={title}
                            isCompleted={isCompleted}
                            isOpen={isOpen}
                            reward={reward}
                        />
                        {isOpen && (
                            <TaskContent
                                description={description}
                                isCompleted={isCompleted}
                                action={action}
                                referralSteps={referralSteps}
                                completionCheck={completionCheck}
                                userProgress={userProgress}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
