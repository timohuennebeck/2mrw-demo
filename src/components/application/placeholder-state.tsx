import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlaceholderStateProps {
    icon: LucideIcon;
    iconStyles?: string;
    title: string;
    description: string;
    ctaLabel?: string;
    onClick?: () => void;
}

export const PlaceholderState = ({
    icon: Icon,
    title,
    description,
    iconStyles,
    ctaLabel,
    onClick,
}: PlaceholderStateProps) => {
    return (
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-8">
            <Icon className={cn("h-8 w-8 text-muted-foreground", iconStyles)} strokeWidth={1.5} />
            <div className="flex flex-col items-center justify-center gap-1">
                <h3 className="text-base font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            {ctaLabel && onClick && (
                <Button onClick={onClick} size="sm" variant="outline">
                    {ctaLabel}
                </Button>
            )}
        </div>
    );
};
