import { defaultPricingPlans } from "@/data/marketing/pricing-data";

const allPlans = [
    ...defaultPricingPlans.monthly,
    ...defaultPricingPlans.annual,
    ...defaultPricingPlans.oneTime,
];

export const getSubscriptionTier = (stripePriceId: string) => {
    const plan = allPlans.find((p) => p.stripe_price_id === stripePriceId);
    return { subscriptionTier: plan?.subscription_tier };
};

export const getBillingPlan = (stripePriceId: string) => {
    const plan = allPlans.find((p) => p.stripe_price_id === stripePriceId);
    return { billingPlan: plan?.billing_plan };
};

export const getBillingPeriod = (stripePriceId: string) => {
    const plan = allPlans.find((p) => p.stripe_price_id === stripePriceId);
    return { billingPeriod: plan?.billing_period };
};
