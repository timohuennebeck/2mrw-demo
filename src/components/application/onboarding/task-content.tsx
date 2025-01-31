import { Button } from "@/components/ui/button";
import { CompletionCheckField, OnboardingTaskConfig } from "@/config/onboarding.config";
import { useUser } from "@/context/UserContext";
import { cn } from "@/lib/utils";
import { claimReward } from "@/services/domain/onboardingService";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ReferralSteps } from "./referral-steps";
import { queryClient } from "@/lib/qClient/qClient";

interface TaskContentProps {
    taskId: string;
    description: string;
    isCompleted: boolean;
    canClaim: boolean;
    action: OnboardingTaskConfig["action"];
    multipleSteps?: number;
    completionCheck?: OnboardingTaskConfig["completionCheck"];
    userProgress: { [K in CompletionCheckField]: number };
    reward: OnboardingTaskConfig["reward"];
}

export const TaskContent = ({
    taskId,
    description,
    isCompleted,
    canClaim,
    action,
    multipleSteps,
    completionCheck,
    userProgress,
    reward,
}: TaskContentProps) => {
    const { dbUser } = useUser();

    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const handleClaimBonus = async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!dbUser) return;

        try {
            setIsLoading(true);
            const result = await claimReward(dbUser.id, taskId);
            queryClient.invalidateQueries({ queryKey: ["claimedRewards"] });

            if (result.success) {
                toast.success(`Bonus Claimed! You've earned +${reward.amount} Tokens!`);
                setTimeout(() => setIsLoading(false), 1000);
            }
        } catch (error) {
            toast.error("Failed to claim reward");
            setIsLoading(false);
        }
    };

    return (
        <>
            <p
                className={cn(
                    "mt-1 text-xs text-muted-foreground",
                    !canClaim && isCompleted && "line-through",
                )}
            >
                {description}
            </p>

            {canClaim && !isCompleted && (
                <Button
                    size="xs"
                    onClick={handleClaimBonus}
                    disabled={isLoading}
                    isLoading={isLoading}
                    className="mt-2 flex items-center gap-1.5 bg-blue-600 text-white hover:bg-blue-700"
                >
                    Claim Reward
                </Button>
            )}

            {!canClaim && !isCompleted && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        router.push(action.href);
                    }}
                    className="mt-2 inline-flex items-center gap-1 rounded-md text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                    {action.label}
                    <ArrowRight className="h-3 w-3" />
                </button>
            )}

            {multipleSteps && completionCheck && !canClaim && (
                <ReferralSteps
                    steps={multipleSteps}
                    completed={userProgress[completionCheck.field as CompletionCheckField]}
                />
            )}
        </>
    );
};
