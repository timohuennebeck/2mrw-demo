import {
    DefaultPricingPlan,
    defaultPricingPlans,
    isFreePlanEnabled,
    pricingCardFeatures,
    pricingComparisonFeatures,
    PricingFeatureItem,
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

const _filterPlans = (plans: DefaultPricingPlan[]) => {
    return isFreePlanEnabled()
        ? plans
        : plans.filter((plan) =>
            plan.subscription_tier !== SubscriptionTier.FREE
        );
};

const _filterFeatures = (sections: PricingFeatureSection[]) => {
    if (isFreePlanEnabled()) return sections;

    return sections.map((section) => ({
        ...section,
        items: section.items.map(({ FREE, ...rest }) => rest), // removes the FREE key from the items when the free plan is disabled
    }));
};

export const getFilteredPricingPlans = () => {
    return {
        monthly: _filterPlans(defaultPricingPlans.monthly),
        annual: _filterPlans(defaultPricingPlans.annual),
        oneTime: defaultPricingPlans.oneTime,
        pricingCardFeatures: _filterFeatures(pricingCardFeatures),
        pricingComparisonFeatures: _filterFeatures(pricingComparisonFeatures),
    };
};
