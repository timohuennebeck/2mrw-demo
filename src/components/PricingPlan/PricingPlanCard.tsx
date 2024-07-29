"use client";

import { useSubscriptionData } from "@/hooks/useSubscriptionData";
import { Product } from "@/interfaces/ProductInterfaces";
import { PlanButton } from "./PlanButton";
import { PlanFeatures } from "./PlanFeatures";
import { PlanHeader } from "./PlanHeader";
import { PlanPricing } from "./PlanPricing";

export const PricingPlanCard = (props: Product) => {
    const {
        stripe_price_id,
        is_highlighted,
        name,
        previous_price,
        current_price,
        description,
        features,
    } = props;

    const {
        freeTrialStatus,
        freeTrialInfo,
        subscriptionStatus,
        subscriptionInfo,
        isFreeTrialLoading,
        isSubscriptionLoading,
        supabaseUser,
    } = useSubscriptionData();

    return (
        <div className="bg-white rounded-2xl shadow-lg border p-8 relative">
            <div className="mb-6">
                <PlanHeader
                    freeTrialInfo={freeTrialInfo}
                    freeTrialStatus={freeTrialStatus}
                    isHighlighted={is_highlighted}
                    name={name}
                    stripePriceId={stripe_price_id}
                />

                <PlanPricing currentPrice={current_price} previousPrice={previous_price} />

                <p className="text-gray-600 text-sm mb-4">{description}</p>

                <PlanFeatures features={features} />
            </div>

            <PlanButton
                freeTrialStatus={freeTrialStatus}
                isLoading={isFreeTrialLoading || isSubscriptionLoading}
                stripePriceId={stripe_price_id}
                subscriptionInfo={subscriptionInfo}
                subscriptionStatus={subscriptionStatus}
                supabaseUser={supabaseUser?.user ?? null}
            />

            <p className="text-center text-sm text-gray-600 mt-4">Purchase Once. Forever Yours.</p>
        </div>
    );
};
