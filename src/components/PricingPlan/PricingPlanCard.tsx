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
import { TextConstants } from "@/constants/TextConstants";

interface PricingPlanCardProps extends Product {
    supabaseUser: User | null;
    freeTrialStatus: FreeTrialStatus;
    freeTrialInfo: FreeTrial;
    subscriptionStatus: SubscriptionStatus;
    subscriptionInfo: PurchasedSubscription;
    isLoading: boolean;
    billingCycle: "monthly" | "yearly";
    setBillingCycle: (cycle: "monthly" | "yearly") => void;
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
        billingCycle,
    } = props;

    const getStripePriceId = () => {
        if (isOneTimePaymentEnabled()) {
            return pricing?.one_time?.stripe_price_id ?? "";
        }

        return billingCycle === "yearly"
            ? (pricing?.subscription?.yearly?.stripe_price_id ?? "")
            : (pricing?.subscription?.monthly?.stripe_price_id ?? "");
    };

    const renderPaymentTypeText = () => {
        if (isOneTimePaymentEnabled()) {
            return (
                <div className="flex flex-col items-center gap-1 text-sm text-neutral-500">
                    <p>Purchase once, own forever.</p>
                </div>
            );
        }

        return (
            <div className="flex flex-col items-center gap-1 text-sm text-neutral-500">
                <p>{TextConstants.TEXT__FLEXIBLE_CANCELLATION}</p>
            </div>
        );
    };

    return (
        <div className="relative max-w-lg rounded-md border p-8">
            <div className="mb-6">
                <PlanHeader
                    freeTrialInfo={freeTrialInfo}
                    freeTrialStatus={freeTrialStatus}
                    isHighlighted={is_highlighted}
                    name={name}
                    stripePriceId={getStripePriceId()}
                />

                <PlanPricing pricing={pricing} billingCycle={billingCycle} />

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
                stripePriceId={getStripePriceId()}
            />

            <div className="mt-4">{renderPaymentTypeText()}</div>
        </div>
    );
};
