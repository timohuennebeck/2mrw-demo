import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";

interface TaskHeaderProps {
    title: string;
    isCompleted: boolean;
    isOpen: boolean;
    reward: {
        amount: number;
        unit: string;
    };
}

export const TaskHeader = ({ title, isCompleted, isOpen, reward }: TaskHeaderProps) => {
    return (
        <div className="flex items-center justify-between gap-3">
            <h4
                className={cn(
                    "text-sm leading-none",
                    isCompleted && "text-muted-foreground line-through",
                )}
            >
                {title}
            </h4>
            <div className="flex flex-shrink-0 items-center gap-2">
                <span
                    className={cn(
                        "whitespace-nowrap text-xs font-medium",
                        isCompleted ? "text-muted-foreground line-through" : "text-black",
                    )}
                >
                    +{reward.amount} {reward.unit}
                </span>
                {isOpen ? (
                    <ChevronUp className="h-3.5 w-3.5" />
                ) : (
                    <ChevronDown className="h-3.5 w-3.5" />
                )}
            </div>
        </div>
    );
};
