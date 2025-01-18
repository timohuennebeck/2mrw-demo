import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface PlaceholderStateProps {
    title: string;
    description: string;
    fadeTitle?: boolean;
    icon?: LucideIcon;
    iconStyles?: string;
    ctaLabel?: string;
    onClick?: () => void;
}

export const PlaceholderState = ({
    title,
    description,
    fadeTitle,
    icon: Icon,
    iconStyles,
    ctaLabel,
    onClick,
}: PlaceholderStateProps) => {
    return (
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-8">
            {Icon && (
                <Icon
                    className={cn("h-8 w-8 text-muted-foreground", iconStyles)}
                    strokeWidth={1.5}
                />
            )}
            <div className="flex flex-col items-center justify-center gap-1">
                <h3
                    className={cn(
                        "max-w-lg text-center text-base font-semibold",
                        fadeTitle && "text-muted-foreground",
                    )}
                >
                    {title}
                </h3>
                <p className="max-w-sm text-center text-sm text-muted-foreground">{description}</p>
            </div>
            {ctaLabel && onClick && (
                <Button onClick={onClick} size="sm" variant="outline">
                    {ctaLabel}
                </Button>
            )}
        </div>
    );
};
