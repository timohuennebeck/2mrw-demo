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

const BillingPage = () => {
    const { authUser } = useSession();
    const { products } = useProducts();
    const { subscription, invalidateSubscription } = useSubscription(authUser?.id ?? "");

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
                            {subscription && <CurrentSubscriptionPlan />}

                            {subscription?.status === SubscriptionStatus.ACTIVE && (
                                <ChangeSubscriptionPlan />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default BillingPage;
