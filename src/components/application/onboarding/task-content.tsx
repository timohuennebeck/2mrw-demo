import { CompletionCheckField } from "@/config/onboarding.config";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReferralSteps } from "./referral-steps";

interface TaskContentProps {
    description: string;
    isCompleted: boolean;
    action: {
        href: string;
        label: string;
    };
    referralSteps?: number;
    completionCheck?: {
        field: string;
    };
    userProgress: { [key in CompletionCheckField]: number };
}

export const TaskContent = ({
    description,
    isCompleted,
    action,
    referralSteps,
    completionCheck,
    userProgress,
}: TaskContentProps) => {
    const router = useRouter();

    return (
        <>
            <p className={cn("mt-1 text-xs text-muted-foreground", isCompleted && "line-through")}>
                {description}
            </p>
            {!isCompleted && (
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
            {referralSteps && completionCheck && (
                <ReferralSteps
                    steps={referralSteps}
                    completed={userProgress[completionCheck.field as CompletionCheckField]}
                />
            )}
        </>
    );
};
