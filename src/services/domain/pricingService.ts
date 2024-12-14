import { defaultPricingPlans } from "@/data/marketing/pricing-data";

const allPlans = [
    ...defaultPricingPlans.monthly,
    ...defaultPricingPlans.annual,
    ...defaultPricingPlans.oneTime,
];

export const getPricingPlan = (stripePriceId: string) => {
    return allPlans.find((p) => p.stripe_price_id === stripePriceId);
};