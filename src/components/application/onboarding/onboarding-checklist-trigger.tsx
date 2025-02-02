"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { appConfig, CompletionCheckField, OnboardingConfig, OnboardingTaskConfig } from "@/config";
import { ChevronUp } from "lucide-react";
import { useState } from "react";
import { OnboardingChecklist } from "./onboarding-checklist";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/context/user-context";
import { fetchClaimedRewards } from "@/services/domain/onboarding-service";

interface OnboardingChecklistTriggerProps {
    userProgress: { [K in CompletionCheckField]: number };
    config: OnboardingConfig;
    onClaimBonus?: () => void;
    isClaimingBonus?: boolean;
    bonusClaimed?: boolean;
}

export const OnboardingChecklistTrigger = ({
    userProgress,
    config,
    onClaimBonus,
    isClaimingBonus,
    bonusClaimed = false,
}: OnboardingChecklistTriggerProps) => {
    const { dbUser } = useUser();

    const [isOpen, setIsOpen] = useState(false);

    const { data: claimedTaskIds } = useQuery({
        queryKey: ["claimedRewards", dbUser?.id],
        queryFn: () => fetchClaimedRewards(dbUser!.id),
        enabled: !!dbUser?.id,
    });

    if (!appConfig.onboarding.checklist.isEnabled) return null;

    const tasks = config.tasks.map((task) => {
        const hasClaimed = claimedTaskIds?.data.includes(task.id);
        const meetsTarget =
            userProgress[task.completionCheck.field as CompletionCheckField] >=
            task.completionCheck.target;

        return {
            ...task,
            isCompleted: hasClaimed || (meetsTarget && task.disableRewardForMultipleSteps),
            canClaim: meetsTarget && !hasClaimed,
        } as OnboardingTaskConfig & { isCompleted: boolean; canClaim: boolean };
    });

    const completedTasks = tasks.filter((task) => task.isCompleted).length;
    const progress = Math.round((completedTasks / tasks.length) * 100);

    const position = appConfig.onboarding.checklist.direction === "left" ? "left-4" : "right-4";

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    className={`fixed bottom-4 ${position} z-50 gap-2 shadow-lg`}
                >
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
                    isClaimingBonus={isClaimingBonus}
                />
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
