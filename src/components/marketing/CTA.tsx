import { ChevronRight } from "lucide-react";

interface CTAProps {
    eyebrow?: string;
    title: string;
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

const CTA = ({ eyebrow = "CTA", title, description, primaryButton, secondaryButton }: CTAProps) => {
    return (
        <div className="flex flex-col items-center gap-6">
            <p className="text-sm font-medium text-blue-600">{eyebrow}</p>
            <h2 className="max-w-4xl text-center text-4xl font-medium tracking-tight md:text-5xl">
                {title}
            </h2>

            <p className="max-w-3xl text-center text-lg text-gray-600">{description}</p>

            <div className="flex items-center justify-center gap-4">
                <button
                    onClick={primaryButton.onClick}
                    className="rounded-md bg-black px-6 py-2.5 text-white transition-colors hover:bg-gray-800"
                >
                    {primaryButton.text}
                </button>
                {secondaryButton && (
                    <button
                        onClick={secondaryButton.onClick}
                        className="flex items-center gap-2 rounded-md bg-gray-100 px-6 py-2.5 transition-colors hover:bg-gray-200"
                    >
                        {secondaryButton.text}
                        <ChevronRight className="h-4 w-4" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default CTA;
