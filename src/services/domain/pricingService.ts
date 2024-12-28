import {
    defaultPricingFeatures,
    DefaultPricingPlan,
    defaultPricingPlans,
    isFreePlanEnabled,
    pricingCardFeatures,
    PricingFeatureSection,
} from "@/config";
import { SubscriptionTier } from "@/enums";

const allPlans = [
    ...defaultPricingPlans.monthly,
    ...defaultPricingPlans.annual,
    ...defaultPricingPlans.oneTime,
];

export const getPricingPlan = (stripePriceId: string) => {
    return allPlans.find((p) => p.stripe_price_id === stripePriceId);
};

export const getFilteredPricingPlans = () => {
    const showFreePlan = isFreePlanEnabled();

    const filterPlans = (plans: DefaultPricingPlan[]) => {
        return showFreePlan
            ? plans
            : plans.filter((plan) =>
                plan.subscription_tier !== SubscriptionTier.FREE
            );
    };

    const filterFeatures = (sections: PricingFeatureSection[]) => {
        if (showFreePlan) return sections;

        // omit the 'free' property when free plan is disabled
        return sections.map((section) => ({
            ...section,
            items: section.items.map((item) => ({
                name: item.name,
                pro: item.pro,
                enterprise: item.enterprise,
            })),
        }));
    };

    return {
        monthly: filterPlans(defaultPricingPlans.monthly),
        annual: filterPlans(defaultPricingPlans.annual),
        oneTime: defaultPricingPlans.oneTime,
        pricingCardFeatures: filterFeatures(pricingCardFeatures),
        defaultPricingFeatures: filterFeatures(defaultPricingFeatures),
    };
};
