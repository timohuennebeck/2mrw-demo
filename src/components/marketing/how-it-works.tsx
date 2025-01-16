import { useEffect } from "react";
import { useState } from "react";
import { type LucideIcon } from "lucide-react";
import CustomVideo from "../ui/custom-video";

interface Step {
    number: number;
    title: string;
    description: string;
    icon: LucideIcon;
}

interface HowItWorksParams {
    eyebrow?: string;
    title: React.ReactNode;
    description?: string;
    steps: Step[];
    videoPaths: string[];
}

const HowItWorks = ({ eyebrow, title, description, steps, videoPaths }: HowItWorksParams) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStep((current) => (current + 1) % steps.length);
            setProgress(0); // reset progress when step changes
        }, 4000);

        return () => clearInterval(interval);
    }, [steps.length]);

    useEffect(() => {
        const progressInterval = setInterval(() => {
            setProgress((current) => Math.min(current + 2, 100));
        }, 80); // update every 80ms to complete in about four seconds

        return () => clearInterval(progressInterval);
    }, [currentStep]);

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
                                    {index === currentStep && (
                                        <div
                                            className="absolute w-full bg-blue-500 transition-all duration-100"
                                            style={{ height: `${progress}%` }}
                                        />
                                    )}
                                    {index < currentStep && (
                                        <div className="absolute h-full w-full bg-blue-500" />
                                    )}
                                </div>
                                <div
                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                                        index === currentStep ? "bg-blue-50" : "bg-gray-50"
                                    }`}
                                >
                                    <step.icon className="h-5 w-5 text-blue-600" />
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
                    <CustomVideo src={videoPaths[currentStep]} />
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;
