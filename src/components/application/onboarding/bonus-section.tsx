import { Button } from "@/components/ui/button";
import { OnboardingConfig } from "@/config";
import { CircleCheck } from "lucide-react";

interface BonusSectionProps {
    allTasksCompleted: boolean;
    bonusClaimed: boolean;
    onClaimBonus?: () => void;
    config: OnboardingConfig;
    isClaimingBonus?: boolean;
}

export const BonusSection = ({
    allTasksCompleted,
    bonusClaimed,
    onClaimBonus,
    config,
    isClaimingBonus,
}: BonusSectionProps) => {
    if (!config.bonusReward) return null;

    return (
        <div className="mt-2 rounded-sm border border-dashed p-3">
            <div className="flex items-center justify-between gap-3">
                <p className="text-xs">
                    {allTasksCompleted ? (
                        "You've completed all onboarding tasks!"
                    ) : (
                        <>
                            {config.description}{" "}
                            <span className="font-semibold text-blue-600">
                                +{config.bonusReward.amount} {config.bonusReward.unit}
                            </span>{" "}
                            🎁
                        </>
                    )}
                </p>
                {allTasksCompleted && !bonusClaimed && (
                    <Button
                        size="xs"
                        onClick={onClaimBonus}
                        className="flex items-center gap-1.5"
                        disabled={isClaimingBonus}
                        isLoading={isClaimingBonus}
                    >
                        {`Claim ${config.bonusReward.amount} Tokens`}
                    </Button>
                )}
                {bonusClaimed && (
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CircleCheck className="h-4 w-4 fill-blue-600 stroke-white text-blue-600" />
                        Bonus Claimed
                    </span>
                )}
            </div>
        </div>
    );
};
