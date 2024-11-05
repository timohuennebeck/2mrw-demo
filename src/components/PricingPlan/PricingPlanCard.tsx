"use client";

import { Product, ProductWithPrices } from "@/interfaces/ProductInterfaces";
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
import { PricingModel, StripePrice, SubscriptionInterval } from "@/interfaces/StripePrices";
import { FeatureService } from "@/services/FeatureService";

interface PricingPlanCardProps extends ProductWithPrices {
    supabaseUser: User | null;
    freeTrialStatus: FreeTrialStatus;
    freeTrialData: FreeTrial;
    subscriptionStatus: SubscriptionStatus;
    subscriptionData: PurchasedSubscription;
    isLoading: boolean;
    billingCycle: SubscriptionInterval;
    setBillingCycle: (cycle: SubscriptionInterval) => void;
}

const _getStripePriceId = (prices: StripePrice[], billingCycle: SubscriptionInterval) => {
    if (isOneTimePaymentEnabled()) {
        const oneTimePrice = prices.find((p) => p.pricing_model === PricingModel.ONE_TIME);
        return oneTimePrice?.stripe_price_id ?? "";
    }

    const subscriptionPrices = prices.filter((p) => p.pricing_model === PricingModel.SUBSCRIPTION);

    const subscriptionPrice =
        subscriptionPrices.find((p) => p.subscription_interval === billingCycle)?.stripe_price_id ??
        "";

    return subscriptionPrice;
};

export const PricingPlanCard = (props: PricingPlanCardProps) => {
    const {
        is_highlighted,
        subscription_tier,
        name,
        prices,
        description,
        freeTrialStatus,
        freeTrialData,
        subscriptionStatus,
        subscriptionData,
        isLoading,
        supabaseUser,
        billingCycle,
    } = props;

    const features = FeatureService.getFeaturesByTier(subscription_tier);

    // If user has a current subscription, show feature comparison
    const featureComparison = subscriptionData?.subscription_tier
        ? FeatureService.compareFeatures(subscriptionData.subscription_tier, subscription_tier)
        : null;

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
        <div className="relative flex max-w-lg flex-col justify-between rounded-md border p-8">
            <section className="mb-6">
                <PlanHeader
                    freeTrialData={freeTrialData}
                    freeTrialStatus={freeTrialStatus}
                    isHighlighted={is_highlighted}
                    name={name}
                    stripePriceId={_getStripePriceId(prices, billingCycle) ?? ""}
                />

                <PlanPricing prices={prices} billingCycle={billingCycle} />

                <p className="mb-4 text-sm text-neutral-500">{description}</p>

                <PlanFeatures features={features} newFeatures={featureComparison?.newFeatures} />
            </section>

            <section>
                <PlanButton
                    freeTrialStatus={freeTrialStatus}
                    isLoading={isLoading}
                    subscriptionData={subscriptionData}
                    subscriptionStatus={subscriptionStatus}
                    supabaseUser={supabaseUser ?? null}
                    name={name}
                    stripePriceId={_getStripePriceId(prices, billingCycle) ?? ""}
                />

                <div className="mt-4">{renderPaymentTypeText()}</div>
            </section>
        </div>
    );
};
