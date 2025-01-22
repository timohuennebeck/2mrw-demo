"use client";

import {
    CompletionCheckField,
    OnboardingConfig,
    OnboardingTaskConfig,
} from "@/config/onboarding.config";
import { useEffect, useState } from "react";
import { BonusSection } from "./bonus-section";
import { TaskItem } from "./task-item";

interface OnboardingChecklistProps {
    tasks: (OnboardingTaskConfig & { isCompleted: boolean; canClaim: boolean })[];
    userProgress: { [key in CompletionCheckField]: number };
    config: OnboardingConfig;
    onClaimBonus?: () => void;
    bonusClaimed?: boolean;
    isOpen: boolean;
    isClaimingBonus?: boolean;
}

export const OnboardingChecklist = ({
    tasks,
    userProgress,
    config,
    onClaimBonus,
    bonusClaimed = false,
    isOpen,
    isClaimingBonus,
}: OnboardingChecklistProps) => {
    const [openTaskId, setOpenTaskId] = useState(null as null | string);

    // set the first incomplete task as open when the dropdown opens
    useEffect(() => {
        if (isOpen) {
            const firstIncompleteTask = tasks.find((task) => !task.isCompleted && task.canClaim);

            setOpenTaskId(firstIncompleteTask?.id ?? null);
        }
    }, [isOpen, tasks]);

    const completedTasks = tasks.filter((task) => task.isCompleted).length;
    const allTasksCompleted = completedTasks === tasks.length;

    return (
        <div className="max-w-xl">
            <div>
                {tasks.map((task) => (
                    <TaskItem
                        key={task.id}
                        taskId={task.id}
                        {...task}
                        isOpen={openTaskId === task.id}
                        onToggle={() => {
                            setOpenTaskId((prev) => (prev === task.id ? null : task.id));
                        }}
                        userProgress={userProgress}
                    />
                ))}

                <BonusSection
                    allTasksCompleted={allTasksCompleted}
                    bonusClaimed={bonusClaimed}
                    onClaimBonus={onClaimBonus}
                    config={config}
                    isClaimingBonus={isClaimingBonus}
                />
            </div>
        </div>
    );
};
