import React from "react";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
    icon: LucideIcon;
    title: string;
    description: string;
    badge: {
        text: string;
        bgColor?: string;
        textColor?: string;
    };
    metrics?: {
        value: string;
        label: string;
    }[];
}

interface HowItWorksProps {
    eyebrow?: string;
    title: React.ReactNode;
    description?: string;
    steps: Step[];
}

const HowItWorks = ({ eyebrow, title, description, steps }: HowItWorksProps) => {
    return (
        <div className="flex flex-col gap-12">
            {/* Header Section */}
            <div className="flex flex-col items-center gap-4 text-center">
                {eyebrow && <p className="text-sm font-medium text-blue-600">{eyebrow}</p>}
                <h2 className="max-w-4xl text-4xl font-medium leading-tight tracking-tight md:text-5xl">
                    {title}
                </h2>
                {description && <p className="max-w-3xl text-lg text-gray-600">{description}</p>}
            </div>

            {/* Steps Section */}
            <div className="relative flex flex-col gap-16">
                {/* Vertical Line */}
                <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 border-l-2 border-dashed border-gray-200" />

                {steps.map((step, idx) => (
                    <div
                        key={idx}
                        className={`relative flex ${idx % 2 === 0 ? "justify-start" : "justify-end"}`}
                    >
                        <div
                            className={cn(
                                "w-full max-w-[55%] rounded-lg border border-gray-100 bg-white/50 p-6 backdrop-blur-sm",
                                idx % 2 === 0 ? "text-right" : "text-left",
                            )}
                        >
                            <div className="flex flex-col gap-4">
                                <div
                                    className={`flex items-center gap-2 ${
                                        idx % 2 === 0 ? "justify-end" : "justify-start"
                                    }`}
                                >
                                    {idx % 2 === 0 && (
                                        <span
                                            className={`text-sm font-medium uppercase ${
                                                step.badge.textColor ?? "text-blue-600"
                                            }`}
                                        >
                                            {step.badge.text}
                                        </span>
                                    )}
                                    <div
                                        className={`rounded-lg ${
                                            step.badge.bgColor ?? "bg-blue-50"
                                        } p-2`}
                                    >
                                        <step.icon
                                            className={`h-5 w-5 ${
                                                step.badge.textColor ?? "text-blue-600"
                                            }`}
                                        />
                                    </div>
                                    {idx % 2 !== 0 && (
                                        <span
                                            className={`text-sm font-medium uppercase ${
                                                step.badge.textColor ?? "text-blue-600"
                                            }`}
                                        >
                                            {step.badge.text}
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-xl font-medium">{step.title}</h3>
                                    <p className="text-gray-600">{step.description}</p>

                                    {/* Optional Metrics */}
                                    {step.metrics && (
                                        <div
                                            className={`mt-4 flex gap-6 ${
                                                idx % 2 === 0 ? "justify-end" : "justify-start"
                                            }`}
                                        >
                                            {step.metrics.map((metric, midx) => (
                                                <div key={midx} className="flex flex-col gap-1">
                                                    <span className="text-2xl font-semibold">
                                                        {metric.value}
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        {metric.label}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HowItWorks;
