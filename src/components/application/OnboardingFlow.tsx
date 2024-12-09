import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Manrope } from "next/font/google";

const manrope = Manrope({
    subsets: ["latin"],
    variable: "--font-manrope",
});

interface OnboardingFlowParams {
    title: string;
    description: string;
    currentStep: number;
    totalSteps: number;
    children: React.ReactNode;
    onSkip?: () => void;
    showSkip?: boolean;
}

const OnboardingFlow = ({
    title,
    description,
    currentStep,
    totalSteps,
    children,
    onSkip,
    showSkip,
}: OnboardingFlowParams) => {
    const router = useRouter();

    const handleSkip = () => {
        if (onSkip) {
            onSkip();
        } else {
            router.push("/dashboard");
        }
    };

    const handlePrevious = () => {
        const prevStep = currentStep - 1;
        if (prevStep >= 1) {
            router.push(`/onboarding?step=${prevStep}`);
        }
    };

    return (
        <div className={`flex min-h-screen justify-center ${manrope.variable} font-manrope`}>
            <div className="w-full max-w-[596px] px-4 py-8 md:mt-[12vh] md:px-16">
                <div className="flex flex-col">
                    {/* Logo */}
                    <div className="mb-4 flex items-center gap-2">
                        <Image
                            src="https://framerusercontent.com/images/XmxX3Fws7IH91jzhxBjAhC9CrPM.svg"
                            alt="logo"
                            width={40}
                            height={40}
                            className="w-8 md:w-10"
                        />
                    </div>

                    {/* Header */}
                    <div className="grid gap-2">
                        <h1 className="text-xl font-semibold md:text-2xl">{title}</h1>
                        <p className="text-xs text-gray-400 md:text-sm">{description}</p>
                    </div>

                    {/* Step Indicator */}
                    <div className="my-6 flex justify-center gap-1 md:my-8 md:gap-2">
                        {[...Array(totalSteps)].map((_, index) => (
                            <div
                                key={index}
                                className={`h-1 w-8 rounded-full transition-all md:w-16 ${
                                    index + 1 === currentStep ? "bg-primary" : "bg-gray-200"
                                }`}
                            />
                        ))}
                    </div>

                    <div className="flex-1">{children}</div>

                    <div className="mt-6 flex flex-col gap-4 md:mt-8">
                        <div className="flex flex-col-reverse justify-between gap-2 md:flex-row">
                            {currentStep > 1 ? (
                                <Button
                                    onClick={handlePrevious}
                                    variant="ghost"
                                    className="w-full text-gray-500 md:w-auto"
                                >
                                    Previous
                                </Button>
                            ) : (
                                <div />
                            )}

                            {showSkip && (
                                <Button
                                    onClick={handleSkip}
                                    variant="ghost"
                                    className="w-full text-gray-500 md:w-auto"
                                >
                                    Let's do this step later...
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnboardingFlow;
