"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { appConfig, CompletionCheckField, OnboardingConfig } from "@/config";
import { ChevronUp } from "lucide-react";
import { useState } from "react";
import { OnboardingChecklist } from "./onboarding-checklist";

interface OnboardingChecklistTriggerProps {
    userProgress: { [key in CompletionCheckField]: number };
    config: OnboardingConfig;
    onClaimBonus?: () => void;
    bonusClaimed?: boolean;
}

export const OnboardingChecklistTrigger = ({
    userProgress,
    config,
    onClaimBonus,
    bonusClaimed = false,
}: OnboardingChecklistTriggerProps) => {
    const [isOpen, setIsOpen] = useState(false);

    if (!appConfig.onboarding.checklist.isEnabled) return null;

    const tasks = config.tasks.map((task) => ({
        ...task,
        isCompleted:
            userProgress[task.completionCheck.field as CompletionCheckField] >=
            task.completionCheck.target,
    }));

    const completedTasks = tasks.filter((task) => task.isCompleted).length;
    const progress = Math.round((completedTasks / tasks.length) * 100);

    const position = appConfig.onboarding.checklist.direction === "left" ? "left-4" : "right-4";

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className={`fixed bottom-4 ${position} gap-2 shadow-lg`}>
                    <div className="flex items-center gap-2 text-sm">
                        {config.title}
                        <Badge className="rounded-sm" variant="blue">
                            {progress}%
                        </Badge>
                        <ChevronUp className="h-4 w-4" />
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align={appConfig.onboarding.checklist.direction === "left" ? "start" : "end"}
                className="w-[448px] p-2"
                sideOffset={16}
            >
                <OnboardingChecklist
                    tasks={tasks}
                    userProgress={userProgress}
                    config={config}
                    onClaimBonus={onClaimBonus}
                    bonusClaimed={bonusClaimed}
                    isOpen={isOpen}
                />
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
