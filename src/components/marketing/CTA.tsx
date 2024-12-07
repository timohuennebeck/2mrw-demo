import { ChevronRight } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

interface CTAParams {
    eyebrow?: string;
    title: React.ReactNode;
    description: string;
    primaryButton: {
        text: string;
        onClick?: (e: React.MouseEvent) => void;
    };
    secondaryButton?: {
        text: string;
        onClick?: (e: React.MouseEvent) => void;
    };
}

const CTA = ({ eyebrow, title, description, primaryButton, secondaryButton }: CTAParams) => {
    return (
        <div className="flex flex-col items-center gap-6">
            <p className="text-sm font-medium text-blue-600">{eyebrow}</p>
            <h2 className="max-w-4xl text-center text-4xl font-medium tracking-tight md:text-5xl">
                {title}
            </h2>

            <p className="max-w-3xl text-center text-lg text-gray-600">{description}</p>

            <div className="flex items-center justify-center gap-4">
                <Button size="lg" onClick={primaryButton.onClick}>
                    {primaryButton.text}
                </Button>
                {secondaryButton && (
                    <Button size="lg" variant="secondary" onClick={secondaryButton.onClick}>
                        {secondaryButton.text}
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );
};

export default CTA;
