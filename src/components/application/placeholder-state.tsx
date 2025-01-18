import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface PlaceholderStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    ctaLabel?: string;
    onClick?: () => void;
}

export const PlaceholderState = ({
    icon: Icon,
    title,
    description,
    ctaLabel,
    onClick,
}: PlaceholderStateProps) => {
    return (
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed p-8">
            <Icon className="h-8 w-8 text-muted-foreground" strokeWidth={1.5} />
            <div className="flex flex-col items-center justify-center gap-1">
                <h3 className="text-base font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            {ctaLabel && onClick && (
                <Button onClick={onClick} size="sm" variant="outline">
                    {ctaLabel}
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            )}
        </div>
    );
};
