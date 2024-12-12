"use client";

import CurrentSubscriptionPlan from "@/components/application/CurrentSubscriptionPlan";
import { Button } from "@/components/ui/button";
import { Manrope } from "next/font/google";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import Confetti from "react-confetti";

const manrope = Manrope({
    subsets: ["latin"],
    variable: "--font-manrope",
});

const SubscriptionSuccess = () => {
    const [showConfetti, setShowConfetti] = React.useState(true);
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => setShowConfetti(false), 5000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            <div className="fixed inset-0 -z-10 h-full w-full">
                <div className="h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
            </div>

            <div
                className={`${manrope.variable} flex min-h-screen items-center justify-center font-manrope p-4 sm:p-8`}
            >
                {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}

                <div className="container max-w-7xl">
                    <div className="mx-auto flex flex-col gap-12">
                        {/* Header Section */}
                        <div className="flex flex-col gap-4 text-center sm:gap-6">
                            <p className="text-sm font-medium text-blue-600">
                                SUBSCRIPTION CONFIRMED
                            </p>
                            <h2 className="text-3xl font-medium leading-tight tracking-tight sm:text-4xl md:text-5xl">
                                Thank You!{" "}
                                <span className="relative mt-2 inline-block whitespace-normal bg-blue-600 p-2 text-white sm:mt-4 sm:whitespace-nowrap">
                                    You're all set
                                </span>
                            </h2>
                            <p className="mx-auto max-w-2xl text-base text-gray-600 sm:text-lg">
                                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Obcaecati
                                ullam eveniet laborum numquam quae quasi!
                            </p>
                        </div>

                        {/* Subscription Details */}
                        <div className="mx-auto w-full max-w-2xl">
                            <CurrentSubscriptionPlan />
                        </div>

                        {/* CTA Button */}
                        <div className="flex flex-col justify-center gap-4 sm:flex-row sm:gap-4">
                            <Button
                                size="sm"
                                variant="ghost"
                                className="w-full sm:w-auto"
                                onClick={() => router.push("/dashboard")}
                            >
                                Continue to Dashboard
                            </Button>
                            <Button
                                size="sm"
                                className="w-full sm:w-auto"
                                onClick={() => router.push("/dashboard/billing")}
                            >
                                Continue to Billing
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SubscriptionSuccess;
