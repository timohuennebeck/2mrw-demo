"use client";

import CurrentSubscriptionPlan from "@/components/application/CurrentSubscriptionPlan";
import { Button } from "@/components/ui/button";
import { useFreeTrial } from "@/context/FreeTrialContext";
import { useSubscription } from "@/context/SubscriptionContext";
import { useUser } from "@/context/UserContext";
import { PurchasedSubscription } from "@/interfaces";
import { FreeTrial } from "@/interfaces/models/freeTrial";
import { Manrope } from "next/font/google";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import Confetti from "react-confetti";

const manrope = Manrope({
    subsets: ["latin"],
    variable: "--font-manrope",
});

const PlanConfirmation = () => {
    const { subscription } = useSubscription();
    const { dbUser } = useUser();
    const { freeTrial } = useFreeTrial();

    const router = useRouter();
    const searchParams = useSearchParams();

    const mode = searchParams.get("mode");

    const [showConfetti, setShowConfetti] = React.useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setShowConfetti(false), 5000);
        return () => clearTimeout(timer);
    }, []);

    const getHeaderContent = () => {
        switch (mode) {
            case "free-trial":
                return {
                    badge: "FREE TRIAL ACTIVATED",
                    title: "Hello there!",
                    subtitle:
                        "Your free trial has started. You now have full access to all our premium features until the 25-12-2024.",
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
                    subtitle: "Your plan has been successfully activated.",
                    highlightText: "You're all set",
                };
        }
    };

    const headerContent = getHeaderContent();

    return (
        <>
            <div className="fixed inset-0 -z-10 h-full w-full">
                <div className="h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
            </div>

            {showConfetti && (
                <Confetti
                    width={window.innerWidth}
                    recycle={false}
                    numberOfPieces={200}
                    style={{ zIndex: 999 }}
                />
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
                            <p className="mx-auto max-w-2xl text-base text-gray-600 sm:text-lg">
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
                                variant="ghost"
                                className="w-full sm:w-auto"
                                onClick={() => router.push("/dashboard")}
                            >
                                Go to Dashboard
                            </Button>
                            <Button
                                size="sm"
                                className="w-full sm:w-auto"
                                onClick={() => router.push("/dashboard/billing")}
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

export default PlanConfirmation;
