import { CompletionCheckField, OnboardingTaskConfig } from "@/config/onboarding.config";
import { cn } from "@/lib/utils";
import { TaskContent } from "./task-content";
import { TaskHeader } from "./task-header";
import { TaskStatus } from "./task-status";

interface TaskItemProps {
    taskId: string;
    title: string;
    description: string;
    isCompleted: boolean;
    disabled?: boolean;
    reward: OnboardingTaskConfig["reward"];
    action: OnboardingTaskConfig["action"];
    multipleSteps?: number;
    completionCheck?: OnboardingTaskConfig["completionCheck"];
    isOpen: boolean;
    onToggle: () => void;
    userProgress: { [K in CompletionCheckField]: number };
    canClaim: boolean;
}

export const TaskItem = ({
    taskId,
    title,
    description,
    isCompleted,
    disabled,
    reward,
    action,
    multipleSteps,
    completionCheck,
    isOpen,
    onToggle,
    userProgress,
    canClaim,
}: TaskItemProps) => {
    return (
        <div className="relative">
            <div
                className={cn(
                    "relative cursor-pointer rounded-lg p-3 transition-colors hover:bg-gray-50 dark:hover:bg-secondary",
                    disabled && "opacity-50",
                    isCompleted && "opacity-50 hover:opacity-75",
                    isOpen && "bg-gray-50 dark:bg-secondary",
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
                                taskId={taskId}
                                canClaim={canClaim}
                                description={description}
                                isCompleted={isCompleted}
                                action={action}
                                multipleSteps={multipleSteps}
                                completionCheck={completionCheck}
                                userProgress={userProgress}
                                reward={reward}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
