"use client";

import DefaultButton from "@/components/DefaultButton";
import { PricingPlanCard } from "@/components/PricingPlanCard";
import { SUBSCRIPTION_PLANS } from "@/config/subscriptionPlans";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const ChoosePricingPlanPage = () => {
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = async () => {
        try {
            const { error } = await supabase.auth.signOut();

            if (error) {
                console.error("Error signing out:", error.message);
                toast.error(`Error signing out: ${error.message}`);
            } else {
                toast.success("Sign out successful!");

                router.replace("/auth/signIn");
            }
        } catch (err) {
            console.error("Unexpected error during sign out:", err);

            toast.error(`There has been an unexpected error: ${err}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="absolute top-8 right-8">
                <DefaultButton title="Sign out" onClick={handleSignOut} />
            </div>

            <div className="p-8 max-w-4xl w-full">
                <div className="flex justify-center mb-6">
                    <Image src="https://i.imgur.com/e0cWC6I.png" alt="" width={48} height={48} />
                </div>

                <h1 className="text-2xl font-semibold text-center mb-2">Choose a Plan</h1>
                <p className="text-center text-gray-600 mb-8 text-sm">
                    Choose a plan to start using Forj. This is a one-time purchase not a
                    subscription. You can still upgrade your plan later if needed.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {SUBSCRIPTION_PLANS.map((plan, index) => (
                        <PricingPlanCard key={index} {...plan} />
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
