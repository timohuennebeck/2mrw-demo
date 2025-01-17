"use client";

import {
    CompletionCheckField,
    OnboardingConfig,
    OnboardingTaskConfig,
} from "@/config/onboarding.config";
import { useState } from "react";
import { BonusSection } from "./bonus-section";
import { TaskItem } from "./task-item";

interface OnboardingChecklistProps {
    tasks: (OnboardingTaskConfig & { isCompleted: boolean })[];
    userProgress: { [key in CompletionCheckField]: number };
    config: OnboardingConfig;
    onClaimBonus?: () => void;
    bonusClaimed?: boolean;
}

export const OnboardingChecklist = ({
    tasks,
    userProgress,
    config,
    onClaimBonus,
    bonusClaimed = false,
}: OnboardingChecklistProps) => {
    const [openTaskId, setOpenTaskId] = useState(null as null | string);

    const completedTasks = tasks.filter((task) => task.isCompleted).length;
    const allTasksCompleted = completedTasks === tasks.length;

    return (
        <div className="max-w-xl">
            <div>
                {tasks.map((task) => (
                    <TaskItem
                        key={task.id}
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
                />
            </div>
        </div>
    );
};
