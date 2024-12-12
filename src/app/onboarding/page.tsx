"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import OnboardingFlow from "@/components/application/OnboardingFlow";
import { createClient } from "@/services/integration/client";
import { User } from "@supabase/supabase-js";
import { useSession } from "@/context/SessionContext";

const _updateOnboardingStatusDatabase = async (authUser: User) => {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("users")
        .update({ onboarding_completed: true })
        .eq("id", authUser?.id);

    if (error) {
        return { data: null, error };
    }

    return { data, error: null };
};

const _udpateOnboardingStatusMetadata = async () => {
    const supabase = createClient();

    const { data, error } = await supabase.auth.updateUser({
        data: {
            onboarding_completed: true,
        },
    });

    if (error) {
        return { data: null, error };
    }

    return { data, error: null };
};

interface OnboardingStep {
    title: string;
    description: string;
    buttonText: string;
    content: () => React.ReactNode;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
    {
        title: "Lorem, ipsum dolor.",
        description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto, quas?",
        buttonText: "Let's do it",
        content: () => (
            <div className="flex flex-col gap-6">
                <div className="flex gap-4">
                    <div className="h-20 w-20 rounded-md bg-gray-200" />
                    <div className="h-20 w-20 rounded-md bg-gray-200" />
                    <div className="h-20 w-20 rounded-md bg-gray-200" />
                    <div className="h-20 w-20 rounded-md bg-gray-200" />
                </div>
            </div>
        ),
    },
    {
        title: "Lorem, ipsum dolor.",
        description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto, quas?",
        buttonText: "Let's do it",
        content: () => (
            <div className="flex flex-col gap-6">
                <div className="flex gap-4">
                    <div className="h-20 w-20 rounded-md bg-gray-200" />
                    <div className="h-20 w-20 rounded-md bg-gray-200" />
                    <div className="h-20 w-20 rounded-md bg-gray-200" />
                </div>
            </div>
        ),
    },
    {
        title: "Lorem, ipsum dolor.",
        description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto, quas?",
        buttonText: "Let's do it",
        content: () => (
            <div className="flex flex-col gap-6">
                <div className="flex gap-4">
                    <div className="h-20 w-20 rounded-md bg-gray-200" />
                    <div className="h-20 w-20 rounded-md bg-gray-200" />
                </div>
            </div>
        ),
    },
    {
        title: "Lorem, ipsum dolor.",
        description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto, quas?",
        buttonText: "Launch 2mrw",
        content: () => (
            <div className="flex flex-col gap-6">
                <div className="flex gap-4">
                    <div className="h-20 w-20 rounded-md bg-gray-200" />
                </div>
            </div>
        ),
    },
];

const OnboardingPage = () => {
    const router = useRouter();
    const { authUser } = useSession();

    const searchParams = useSearchParams();
    const currentStep = parseInt(searchParams.get("step") || "1");

    const continueStep = (step: number) => {
        router.push(`/onboarding?step=${step}`);
    };

    const handleContinue = async () => {
        if (currentStep === ONBOARDING_STEPS.length) {
            await _updateOnboardingStatusDatabase(authUser as User);
            await _udpateOnboardingStatusMetadata();

            // if it's the last step, redirect to dashboard
            router.push("/dashboard");
        } else {
            // otherwise, go to next step
            continueStep(currentStep + 1);
        }
    };

    const currentStepData = ONBOARDING_STEPS[currentStep - 1];

    return (
        <OnboardingFlow
            title={currentStepData.title}
            description={currentStepData.description}
            currentStep={currentStep}
            totalSteps={ONBOARDING_STEPS.length}
            onSkip={() => continueStep(currentStep + 1)}
            showSkip={currentStep !== ONBOARDING_STEPS.length} // hides the skip button on the last step
            buttonText={currentStepData.buttonText}
            onContinue={handleContinue}
        >
            {currentStepData.content()}
        </OnboardingFlow>
    );
};

export default OnboardingPage;
