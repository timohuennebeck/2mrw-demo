"use client";

import { Product } from "@/interfaces/ProductInterfaces";
import { PlanButton } from "./PlanButton";
import { PlanFeatures } from "./PlanFeatures";
import { PlanHeader } from "./PlanHeader";
import { PlanPricing } from "./PlanPricing";
import { User } from "@supabase/supabase-js";
import { PurchasedSubscription } from "@/interfaces/SubscriptionInterfaces";
import { SubscriptionStatus } from "@/enums/SubscriptionStatus";
import { FreeTrial } from "@/interfaces/FreeTrial";
import { FreeTrialStatus } from "@/enums/FreeTrialStatus";

interface PricingPlanCardProps extends Product {
    supabaseUser: User | null;
    freeTrialStatus: FreeTrialStatus;
    freeTrialInfo: FreeTrial;
    subscriptionStatus: SubscriptionStatus;
    subscriptionInfo: PurchasedSubscription;
    isLoading: boolean;
}

export const PricingPlanCard = (props: PricingPlanCardProps) => {
    const {
        stripe_price_id,
        is_highlighted,
        name,
        previous_price,
        current_price,
        description,
        features,
        freeTrialStatus,
        freeTrialInfo,
        subscriptionStatus,
        subscriptionInfo,
        isLoading,
        supabaseUser,
    } = props;

    return (
        <div className="relative rounded-md border p-8 max-w-lg">
            <div className="mb-6">
                <PlanHeader
                    freeTrialInfo={freeTrialInfo}
                    freeTrialStatus={freeTrialStatus}
                    isHighlighted={is_highlighted}
                    name={name}
                    stripePriceId={stripe_price_id}
                />

                <PlanPricing currentPrice={current_price} previousPrice={previous_price} />

                <p className="mb-4 text-sm text-neutral-500">{description}</p>

                <PlanFeatures features={features} />
            </div>

            <PlanButton
                freeTrialStatus={freeTrialStatus}
                isLoading={isLoading}
                stripePriceId={stripe_price_id}
                subscriptionInfo={subscriptionInfo}
                subscriptionStatus={subscriptionStatus}
                supabaseUser={supabaseUser ?? null}
            />

            <p className="mt-4 text-center text-sm text-neutral-500">Purchase Once. Forever Yours.</p>
        </div>
    );
};
