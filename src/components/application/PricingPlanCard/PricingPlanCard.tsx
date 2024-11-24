"use client";

import { PlanButton } from "../PlanButton/PlanButton";
import { PlanFeatures } from "../PlanFeatures/PlanFeatures";
import { PlanHeader } from "../PlanHeader/PlanHeader";
import { PlanPricing } from "../PlanPricing/PlanPricing";
import { TextConstants } from "@/constants/TextConstants";
import { getFeaturesWithAvailability } from "@/services/domain/featureService";
import { isOneTimePaymentEnabled } from "@/config/paymentConfig";
import { StripePrice } from "@/interfaces";
import { BillingPlan, SubscriptionInterval } from "@/enums";
import { PricingPlanCardParams } from "./PricingPlanCard.interface";

const _getStripePriceId = (prices: StripePrice[], billingCycle: SubscriptionInterval) => {
    if (isOneTimePaymentEnabled()) {
        const oneTimePrice = prices.find((p) => p.billing_plan === BillingPlan.ONE_TIME);
        return oneTimePrice?.stripe_price_id ?? "";
    }

    const subscriptionPrices = prices.filter((p) => p.billing_plan === BillingPlan.RECURRING);

    const subscriptionPrice =
        subscriptionPrices.find((p) => p.subscription_interval === billingCycle)?.stripe_price_id ??
        "";

    return subscriptionPrice;
};

export const PricingPlanCard = (props: PricingPlanCardParams) => {
    const {
        is_highlighted,
        subscription_tier,
        name,
        prices,
        description,
        subscriptionStatus,
        subscriptionData,
        isLoading,
        supabaseUser,
        billingCycle,
    } = props;

    const renderPaymentTypeText = () => {
        if (isOneTimePaymentEnabled()) {
            return (
                <div className="flex flex-col items-center gap-1 text-sm text-gray-500">
                    <p>Purchase once, own forever.</p>
                </div>
            );
        }

        return (
            <div className="flex flex-col items-center gap-1 text-sm text-gray-500">
                <p>{TextConstants.TEXT__FLEXIBLE_CANCELLATION}</p>
            </div>
        );
    };

    return (
        <div className="relative flex max-w-lg flex-col justify-between rounded-md border p-8">
            <section className="mb-6">
                <PlanHeader isHighlighted={is_highlighted} name={name} />

                <PlanPricing prices={prices} billingCycle={billingCycle} />

                <p className="mb-4 text-sm text-gray-500">{description}</p>

                <PlanFeatures features={getFeaturesWithAvailability(subscription_tier)} />
            </section>

            <section>
                <PlanButton
                    isLoading={isLoading}
                    subscriptionTier={subscription_tier}
                    subscriptionData={subscriptionData ?? null}
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
