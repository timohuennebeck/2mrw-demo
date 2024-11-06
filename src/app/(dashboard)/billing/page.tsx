"use client";

import BillingPortal from "@/components/Billing/BillingPortal";
import CurrentSubscriptionPlan from "@/components/Billing/CurrentSubscriptionPlan";
import ChangeSubscriptionPlan from "@/components/Billing/ChangeSubscriptionPlan";
import HeaderWithDescription from "@/components/HeaderWithDescription";
import { useSession } from "@/context/SessionContext";
import { useSubscription } from "@/hooks/useSubscription";
import { useSupabaseRealtime } from "@/hooks/useSupabaseRealtime";
import CustomPopup from "@/components/CustomPopup";
import { Check } from "lucide-react";
import { useState } from "react";
import useSuccessParam from "@/hooks/useSuccessParam";
import { useProducts } from "@/context/ProductsContext";
import CurrentSubscriptionPlanSkeleton from "@/components/ui/CurrentSubscriptionPlanSkeleton";
import ChangeSubscriptionPlanSkeleton from "@/components/ui/ChangeSubscriptionPlanSkeleton";
import { SubscriptionStatus } from "@/enums/SubscriptionStatus";
import { BillingPlan } from "@/interfaces/StripePrices";

const BillingPage = () => {
    const { authUser } = useSession();
    const { products } = useProducts();
    const { subscription, invalidateSubscription, isLoading } = useSubscription(authUser?.id ?? "");

    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    useSupabaseRealtime({
        table: "user_subscriptions",
        filter: `user_id=eq.${authUser?.id}`,
        onChange: invalidateSubscription,
    });

    useSuccessParam({
        onSuccess: () => setShowSuccessPopup(true),
        redirectPath: "/billing",
    });

    /**
     * the ChangeSubscriptionPlan component is only shown if the user has not yet purchased a plan (one-time or recurring)
     * and if he has not cancelled his recurring subscription
     * otherwise, it's hidden because once a user has purchased a OTP plan, he cannot change the plan
     */

    const hasOneTimePaymentPlan = subscription?.billing_plan === BillingPlan.ONE_TIME;
    const hasCancelledSubscription = subscription?.status === SubscriptionStatus.CANCELLED;

    const showChangeSubscriptionPlan =
        !isLoading && !hasOneTimePaymentPlan && !hasCancelledSubscription;

    return (
        <>
            {showSuccessPopup && (
                <CustomPopup
                    title="Subscription Confirmed!"
                    description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur, itaque!"
                    icon={<Check size={32} strokeWidth={1.5} className="text-green-500" />}
                    iconBackgroundColor="bg-green-100"
                    mainButtonText="Continue"
                    onConfirm={() => setShowSuccessPopup(false)}
                    hideSecondaryButton
                    showConfetti
                />
            )}

            <div className="container max-w-3xl bg-white">
                <HeaderWithDescription
                    title="Billing"
                    description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur, itaque!"
                    isPageHeader
                />

                <div className="flex flex-col gap-6">
                    <BillingPortal />

                    {!products ? (
                        <div className="flex flex-col gap-6">
                            <CurrentSubscriptionPlanSkeleton />
                            <ChangeSubscriptionPlanSkeleton />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {!isLoading && subscription?.stripe_price_id !== undefined && (
                                <CurrentSubscriptionPlan />
                            )}

                            {showChangeSubscriptionPlan && <ChangeSubscriptionPlan />}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default BillingPage;
