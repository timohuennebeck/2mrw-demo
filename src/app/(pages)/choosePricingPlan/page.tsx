"use client";

import { PricingPlanCard } from "@/components/PricingPlanCard";
import SignOutButton from "@/components/SignOutButton";
import { SUBSCRIPTION_PLANS } from "@/config/subscriptionPlans";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { useEffect, useState } from "react";

const ChoosePricingPlanPage = () => {
    const supabase = createClient();

    const [userEmail, setUserEmail] = useState("");

    useEffect(() => {
        const fetchUserEmail = async () => {
            try {
                const {
                    data: { user },
                    error,
                } = await supabase.auth.getUser();

                if (error) throw error;

                if (user) setUserEmail(encodeURIComponent(user.email ?? ""));
            } catch (error) {
                console.error("Error fetching user email:", error);
            }
        };

        fetchUserEmail();
    }, [supabase.auth]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="absolute top-8 right-8">
                <SignOutButton title="Sign out" />
            </div>

            <div className="p-8 max-w-4xl w-full">
                <div className="flex justify-center mb-6">
                    <Image src={process.env.NEXT_PUBLIC_EMAIL_LOGO_BASE_URL ?? ""} alt="" width={48} height={48} />
                </div>

                <h1 className="text-2xl font-semibold text-center mb-2">Choose a Plan</h1>
                <p className="text-center text-gray-600 mb-8 text-sm">
                    Choose a plan to start using Forj. This is a one-time purchase not a
                    subscription. You can still upgrade your plan later if needed.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {SUBSCRIPTION_PLANS.map((plan, index) => (
                        <PricingPlanCard
                            key={index}
                            {...plan}
                            stripePaymentLink={
                                userEmail
                                    ? `${plan.stripePaymentLink}?prefilled_email=${userEmail}`
                                    : plan.stripePaymentLink
                            }
                        />
                    ))}
                </div>

                <p className="text-center text-gray-600 mb-8 text-sm">
                    This limited offer ends November 8th, 2024 at 12 AM CET.
                </p>
            </div>
        </div>
    );
};

export default ChoosePricingPlanPage;
