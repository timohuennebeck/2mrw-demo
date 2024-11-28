"use client";

import { useSession } from "@/context/SessionContext";
import { useSupabaseRealtime } from "@/hooks/useSupabaseRealtime";
import { Check } from "lucide-react";
import { useState } from "react";
import useSuccessParam from "@/hooks/useSuccessParam";
import { useProducts } from "@/context/ProductsContext";
import CurrentSubscriptionPlanSkeleton from "@/components/ui/CurrentSubscriptionPlanSkeleton";
import ChangeSubscriptionPlanSkeleton from "@/components/ui/ChangeSubscriptionPlanSkeleton";
import { TextConstants } from "@/constants/TextConstants";
import { useSubscription } from "@/context/SubscriptionContext";
import CustomPopup from "@/components/application/CustomPopup";
import { BillingPlan, SubscriptionStatus } from "@/enums";
import FormHeader from "@/components/application/FormHeader";
import CurrentSubscriptionPlan from "@/components/application/CurrentSubscriptionPlan";
import ChangeSubscriptionPlan from "@/components/application/ChangeSubscriptionPlan";
import BillingPortal from "@/components/application/BillingPortal";

const BillingPage = () => {
    const { authUser } = useSession();
    const { products } = useProducts();
    const { subscription, invalidateSubscription } = useSubscription();

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

    const showChangeSubscriptionPlan = !hasOneTimePaymentPlan && !hasCancelledSubscription;

    return (
        <>
            {showSuccessPopup && (
                <CustomPopup
                    dataTestId="subscription-success-popup"
                    title={TextConstants.TEXT__SUBSCRIPTION_CONFIRMED}
                    description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur, itaque!"
                    icon={<Check size={32} strokeWidth={1.5} className="text-green-500" />}
                    iconBackgroundColor="bg-green-100"
                    mainButtonText={TextConstants.TEXT__CONTINUE}
                    onConfirm={() => setShowSuccessPopup(false)}
                    hideSecondaryButton
                    showConfetti
                />
            )}

            <div className="container max-w-3xl bg-white">
                <FormHeader
                    title="Billing"
                    description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur, itaque!"
                    isPageHeader
                />

                <div className="flex flex-col gap-6">
                    {subscription?.billing_plan === BillingPlan.RECURRING && <BillingPortal />}

                    {!products ? (
                        <div className="flex flex-col gap-6">
                            {subscription?.stripe_price_id !== undefined && (
                                <CurrentSubscriptionPlanSkeleton />
                            )}

                            {showChangeSubscriptionPlan && <ChangeSubscriptionPlanSkeleton />}
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {subscription?.stripe_price_id !== undefined && (
                                <CurrentSubscriptionPlan products={products} />
                            )}

                            {showChangeSubscriptionPlan && (
                                <ChangeSubscriptionPlan products={products} />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default BillingPage;
