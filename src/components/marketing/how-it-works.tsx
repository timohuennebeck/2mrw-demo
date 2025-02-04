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
        <div className="flex flex-col gap-8 md:gap-12">
            {/* Header Section */}
            <div className="flex flex-col items-center gap-4 px-4 text-center">
                {eyebrow && <p className="text-sm font-medium text-blue-600">{eyebrow}</p>}
                <h2 className="max-w-4xl text-3xl font-medium leading-tight tracking-tight md:text-4xl lg:text-5xl">
                    {title}
                </h2>
                {description && (
                    <p className="max-w-3xl text-base text-muted-foreground md:text-lg">
                        {description}
                    </p>
                )}
            </div>

            {/* Steps Section */}
            <div className="relative flex flex-col gap-8 px-4 md:gap-16">
                {/* Vertical Line - Hidden on mobile */}
                <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 border-l-2 border-dashed border-gray-200" />

                {steps.map((step, idx) => (
                    <div
                        key={idx}
                        className={`relative flex ${
                            idx % 2 === 0 ? "md:justify-start" : "md:justify-end"
                        } justify-center`}
                    >
                        <div
                            className={cn(
                                "w-full rounded-lg border border-gray-100 bg-white p-4 dark:border-border dark:bg-background md:max-w-[55%] md:p-6",
                                idx % 2 === 0 ? "text-left md:text-right" : "text-left",
                            )}
                        >
                            <div className="flex flex-col gap-4">
                                <div
                                    className={`flex items-center gap-2 ${
                                        idx % 2 === 0
                                            ? "justify-start md:justify-end"
                                            : "justify-start"
                                    }`}
                                >
                                    {idx % 2 === 0 && (
                                        <span
                                            className={`hidden text-sm font-medium uppercase md:inline-block ${
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
                                    <span
                                        className={`text-sm font-medium uppercase md:hidden ${
                                            step.badge.textColor ?? "text-blue-600"
                                        }`}
                                    >
                                        {step.badge.text}
                                    </span>
                                    {idx % 2 !== 0 && (
                                        <span
                                            className={`hidden text-sm font-medium uppercase md:inline-block ${
                                                step.badge.textColor ?? "text-blue-600"
                                            }`}
                                        >
                                            {step.badge.text}
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-lg font-medium md:text-xl">{step.title}</h3>
                                    <p className="text-sm text-muted-foreground md:text-base">
                                        {step.description}
                                    </p>

                                    {/* Optional Metrics */}
                                    {step.metrics && (
                                        <div
                                            className={`mt-4 flex gap-4 md:gap-6 ${
                                                idx % 2 === 0
                                                    ? "justify-start md:justify-end"
                                                    : "justify-start"
                                            }`}
                                        >
                                            {step.metrics.map((metric, midx) => (
                                                <div key={midx} className="flex flex-col gap-1">
                                                    <span className="text-xl font-semibold md:text-2xl">
                                                        {metric.value}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground md:text-sm">
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
