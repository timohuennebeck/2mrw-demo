"use client";

import CurrentSubscriptionPlan from "@/components/application/current-subscription-plan";
import { Button } from "@/components/ui/button";
import { useFreeTrial } from "@/context/free-trial-context";
import { useSubscription } from "@/context/subscription-context";
import { useUser } from "@/context/user-context";
import { PurchasedSubscription } from "@/interfaces";
import { FreeTrial } from "@/interfaces/models/free-trial.model";
import moment from "moment";
import { Manrope } from "next/font/google";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { appConfig } from "@/config";
import TexturedBackground from "@/components/ui/textured-background";

const manrope = Manrope({
    subsets: ["latin"],
    variable: "--font-manrope",
});

const Confetti = dynamic(() => import("react-confetti"), {
    ssr: false, // only renders the component on client-side
});

const PlanConfirmationPage = () => (
    <Suspense fallback={null}>
        <PlanConfirmationPageContent />
    </Suspense>
);

const PlanConfirmationPageContent = () => {
    const { subscription, invalidateSubscription } = useSubscription();
    const { dbUser, invalidateUser } = useUser();
    const { freeTrial } = useFreeTrial();

    const router = useRouter();
    const searchParams = useSearchParams();

    const mode = searchParams.get("mode");

    const [showConfetti, setShowConfetti] = useState(true);

    useEffect(() => {
        invalidateUser();
        invalidateSubscription();
        const timer = setTimeout(() => setShowConfetti(false), 5000);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getHeaderContent = () => {
        switch (mode) {
            case "free-trial":
                const freeTrialEndDate = moment(freeTrial?.end_date).format("DD-MM-YYYY");
                return {
                    badge: "FREE TRIAL ACTIVATED",
                    title: "Hello there!",
                    subtitle: `Your free trial has started. You now have full access to all our premium features until ${freeTrialEndDate}.`,
                    highlightText: "Let's get started",
                };
            case "subscription":
                return {
                    badge: "SUBSCRIPTION CONFIRMED",
                    title: "Thank You!",
                    subtitle:
                        "Your subscription has been activated. You now have full access to all our premium features.",
                    highlightText: "You're all set",
                };
            default:
                return {
                    badge: "PLAN CONFIRMED",
                    title: "Thank You!",
                    subtitle: "Your plan has been activated.",
                    highlightText: "You're all set",
                };
        }
    };

    const headerContent = getHeaderContent();

    return (
        <>
            <TexturedBackground />

            {showConfetti && (
                <Confetti recycle={false} numberOfPieces={200} style={{ zIndex: 999 }} />
            )}

            <div
                className={`${manrope.variable} flex min-h-screen items-center justify-center p-4 font-manrope sm:p-8`}
            >
                <div className="container max-w-7xl">
                    <div className="mx-auto flex flex-col gap-12">
                        {/* Header Section */}
                        <div className="flex flex-col gap-4 text-center sm:gap-6">
                            <p className="text-sm font-medium text-blue-600">
                                {headerContent.badge}
                            </p>
                            <h2 className="text-3xl font-medium leading-tight tracking-tight sm:text-4xl md:text-5xl">
                                {headerContent.title}{" "}
                                <span className="relative mt-2 inline-block whitespace-normal bg-blue-600 p-2 text-white sm:mt-4 sm:whitespace-nowrap">
                                    {headerContent.highlightText}
                                </span>
                            </h2>
                            <p className="mx-auto max-w-2xl text-base text-muted-foreground">
                                {headerContent.subtitle}
                            </p>
                        </div>

                        {/* Show subscription details only for paid subscriptions */}
                        <div className="mx-auto w-full max-w-2xl">
                            <CurrentSubscriptionPlan
                                subscription={subscription as PurchasedSubscription}
                                freeTrial={freeTrial as FreeTrial}
                                stripeCustomerId={dbUser?.stripe_customer_id as string}
                                currentPlanStripePriceId={subscription?.stripe_price_id as string}
                            />
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col justify-center gap-4 sm:flex-row sm:gap-4">
                            <Button
                                size="sm"
                                className="w-full sm:w-auto"
                                onClick={() =>
                                    appConfig.onboarding.isEnabled
                                        ? router.push("/onboarding")
                                        : router.push("/app")
                                }
                            >
                                Continue
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="w-full sm:w-auto"
                                onClick={() => router.push("/app/billing")}
                            >
                                Manage Billing
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PlanConfirmationPage;
