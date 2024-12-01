import Image from "next/image";
import { useEffect } from "react";
import { useState } from "react";

interface Step {
    number: number;
    title: string;
    description: string;
    icon: React.ReactNode;
}

interface HowItWorksParams {
    eyebrow?: string;
    title: React.ReactNode;
    description?: string;
    steps: Step[];
    videoPaths: string[];
}

const HowItWorks = ({ eyebrow, title, description, steps, videoPaths }: HowItWorksParams) => {
    const [activeStep, setActiveStep] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveStep((current) => (current + 1) % steps.length);
            setProgress(0); // Reset progress when step changes
        }, 4000);

        return () => clearInterval(interval);
    }, [steps.length]);

    useEffect(() => {
        const progressInterval = setInterval(() => {
            setProgress((current) => Math.min(current + 2, 100));
        }, 80); // Update every 80ms to complete in ~4 seconds

        return () => clearInterval(progressInterval);
    }, [activeStep]);

    return (
        <div className="flex flex-col gap-16">
            {/* Header Section */}
            <div className="flex flex-col gap-6 text-start">
                {eyebrow && <p className="text-sm font-medium text-blue-600">{eyebrow}</p>}
                <h2 className="max-w-4xl text-4xl font-medium leading-tight tracking-tight md:text-5xl">
                    {title}
                </h2>
                {description && <p className="max-w-3xl text-lg text-gray-600">{description}</p>}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                {/* Steps Column */}
                <div className="flex flex-col gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="flex items-start gap-4">
                            <div className="relative flex h-full flex-col items-center self-stretch">
                                <div className="absolute left-0 top-0 h-full w-0.5 -translate-x-4 bg-gray-200">
                                    {index === activeStep && (
                                        <div
                                            className="absolute w-full bg-blue-500 transition-all duration-100"
                                            style={{ height: `${progress}%` }}
                                        />
                                    )}
                                    {index < activeStep && (
                                        <div className="absolute h-full w-full bg-blue-500" />
                                    )}
                                </div>
                                <div
                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                                        index === activeStep ? "bg-blue-50" : "bg-gray-50"
                                    }`}
                                >
                                    {step.icon}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <h3 className="font-medium">
                                    {step.number}. {step.title}
                                </h3>
                                <p className="text-gray-600">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Image Column */}
                <div className="flex items-center">
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-2xl">
                        <video
                            src={videoPaths[activeStep]}
                            width={1200}
                            height={675}
                            className="rounded-lg shadow-2xl"
                            autoPlay
                            muted
                            loop
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;
