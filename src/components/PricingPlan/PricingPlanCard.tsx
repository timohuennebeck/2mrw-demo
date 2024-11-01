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
import { isOneTimePaymentEnabled } from "@/config/paymentConfig";

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
        is_highlighted,
        name,
        pricing,
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
        <div className="relative max-w-lg rounded-md border p-8">
            <div className="mb-6">
                <PlanHeader
                    freeTrialInfo={freeTrialInfo}
                    freeTrialStatus={freeTrialStatus}
                    isHighlighted={is_highlighted}
                    name={name}
                    stripePriceId={
                        isOneTimePaymentEnabled()
                            ? (pricing?.one_time?.stripe_price_id ?? "")
                            : (pricing?.subscription?.monthly?.stripe_price_id ?? "")
                    }
                />

                <PlanPricing pricing={pricing} />

                <p className="mb-4 text-sm text-neutral-500">{description}</p>

                <PlanFeatures features={features} />
            </div>

            <PlanButton
                freeTrialStatus={freeTrialStatus}
                isLoading={isLoading}
                subscriptionInfo={subscriptionInfo}
                subscriptionStatus={subscriptionStatus}
                supabaseUser={supabaseUser ?? null}
                name={name}
                stripePriceId={
                    isOneTimePaymentEnabled()
                        ? (pricing?.one_time?.stripe_price_id ?? "")
                        : (pricing?.subscription?.monthly?.stripe_price_id ?? "")
                }
            />

            <p className="mt-4 text-center text-sm text-neutral-500">
                Purchase Once. Forever Yours.
            </p>
        </div>
    );
};
