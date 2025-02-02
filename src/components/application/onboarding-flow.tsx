import { Button } from "@/components/ui/button";
import { Manrope } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import logo from "@/assets/images/logo.svg";

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
    buttonText: string;
    onContinue: () => void;
}

const OnboardingFlow = ({
    title,
    description,
    currentStep,
    totalSteps,
    children,
    onSkip,
    showSkip,
    buttonText,
    onContinue,
}: OnboardingFlowParams) => {
    const router = useRouter();

    const handleSkip = () => {
        if (onSkip) {
            onSkip();
        } else {
            router.push("/app");
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
            <div className="w-full max-w-[596px] py-8 md:mt-[12vh]">
                <div className="flex w-full flex-col items-center">
                    {/* Logo - centered */}
                    <div className="mb-8 flex items-center justify-center">
                        <Image
                            src={logo}
                            alt="logo"
                            width={40}
                            height={40}
                            className="w-10"
                        />
                    </div>

                    {/* Updated Step Indicator */}
                    <div className="mb-12 flex justify-center gap-4">
                        {[...Array(totalSteps)].map((_, index) => (
                            <div key={index} className="flex items-center">
                                <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-full border ${
                                        index + 1 <= currentStep
                                            ? "border bg-black dark:bg-white text-white dark:text-black"
                                            : "border-gray-200 bg-white dark:bg-black text-muted-foreground"
                                    }`}
                                >
                                    {index + 1}
                                </div>
                                {index < totalSteps - 1 && (
                                    <div className="ml-4 h-[1px] w-8 bg-gray-200" />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Header */}
                    <div className="grid w-full gap-4 text-center">
                        <h1 className="text-xl font-semibold md:text-3xl">{title}</h1>
                        <p className="text-xs text-muted-foreground md:text-sm">{description}</p>
                    </div>

                    {/* Content - Note the max-w-[380px] addition */}
                    <div className="mt-8 w-full max-w-[448px]">
                        {children}

                        <Button onClick={onContinue} className="mt-8 w-full">
                            {buttonText}
                        </Button>
                        {/* Fixed-width buttons */}
                        <div className="mt-4 flex w-full flex-col gap-4">
                            <div className="flex flex-col-reverse justify-between gap-2 md:flex-row">
                                <div className="w-full md:w-[120px]">
                                    {currentStep > 1 && (
                                        <Button
                                            onClick={handlePrevious}
                                            variant="ghost"
                                            className="w-full text-muted-foreground"
                                        >
                                            Previous
                                        </Button>
                                    )}
                                </div>

                                <div className="w-full md:w-[180px]">
                                    {showSkip && (
                                        <Button
                                            onClick={handleSkip}
                                            variant="ghost"
                                            className="w-full text-muted-foreground"
                                        >
                                            Let's do this step later...
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnboardingFlow;
