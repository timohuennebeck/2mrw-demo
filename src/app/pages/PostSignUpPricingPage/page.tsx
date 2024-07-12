"use client";

import DefaultButton from "@/components/DefaultButton";
import { PricingPlanCard } from "@/components/PricingPlanCard";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const PostSignupPricingPage = () => {
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();

            if (error) {
                console.error("Error signing out:", error.message);
                toast.error(`Error signing out: ${error.message}`);
            } else {
                toast.success("You've been signed out ");

                router.replace("/auth/signIn");
            }
        } catch (err) {
            console.error("Unexpected error during sign out:", err);
            toast.error(`There has been an unexpected error: ${err}`);
        }
    };

    const plans = [
        {
            name: "Essentials",
            previousPrice: 53.95,
            price: 44.95,
            description: "*For freelancers and solopreneurs",
            discountInfo: "This plan is 20% off for the first 50 customers (47 left)",
            features: [
                { name: "Feature", included: true },
                { name: "Feature-02", included: true },
                { name: "Feature-03", included: false },
                { name: "Feature-04", included: false },
                { name: "Feature-05", included: false },
            ],
            isHighlighted: false,
        },
        {
            name: "Founders Edition",
            previousPrice: 71.95,
            price: 59.95,
            description: "*For freelancers and solopreneurs",
            discountInfo: "This plan is 20% off for the first 50 customers (47 left)",
            features: [
                { name: "Feature", included: true },
                { name: "Feature-02", included: true },
                { name: "Feature-03", included: true },
                { name: "Feature-04", included: true },
                { name: "Feature-05", included: true },
            ],
            isHighlighted: true,
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="absolute top-8 right-8">
                <DefaultButton title="Sign out" onClick={handleSignOut} />
            </div>

            <div className="p-8 max-w-4xl w-full">
                <div className="flex justify-center mb-6">
                    <img src="https://i.imgur.com/e0cWC6I.png" alt="" className="w-12 h-12" />
                </div>

                <h1 className="text-2xl font-semibold text-center mb-2">Choose a Plan</h1>
                <p className="text-center text-gray-600 mb-8 text-sm">
                    Choose a plan to start using Forj. You can upgrade Your plan at anY time if
                    needed. This is a one-time purchase not a subscription.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {plans.map((plan, index) => (
                        <PricingPlanCard key={index} {...plan} onClick={() => {}} />
                    ))}
                </div>

                <p className="text-center text-gray-600 mb-8 text-sm">
                    This limited offer ends November 8th, 2024 at 12 AM CET.
                </p>
            </div>
        </div>
    );
};

export default PostSignupPricingPage;
