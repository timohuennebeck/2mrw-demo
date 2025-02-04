import { cn } from "@/lib/utils";

interface ReferralStepsProps {
    steps: number;
    completed: number;
}

export const ReferralSteps = ({ steps, completed }: ReferralStepsProps) => {
    return (
        <div className="mt-3 flex items-center gap-2">
            {Array.from({ length: steps }, (_, index) => (
                <div
                    key={index}
                    className={cn(
                        "h-1 w-4 rounded-full transition-colors",
                        index < completed ? "bg-blue-600" : "bg-gray-200",
                    )}
                    title={`Step ${index + 1}${index < completed ? " - Completed" : ""}`}
                />
            ))}
        </div>
    );
};
