import {
    pricingComparisonFeatures,
    DefaultPricingPlan,
    defaultPricingPlans,
    isFreePlanEnabled,
    pricingCardFeatures,
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

        // omit the FREE tier property when free plan is disabled
        return sections.map((section) => ({
            ...section,
            items: section.items.map((item) => {
                const filteredItem: PricingFeatureItem = {
                    name: item.name,
                };

                // only keep non-FREE tier properties
                Object.keys(item).forEach((key) => {
                    if (
                        key !== "name" &&
                        key !== SubscriptionTier.FREE.toLowerCase()
                    ) {
                        filteredItem[key] = item[key];
                    }
                });

                return filteredItem;
            }),
        }));
    };

    return {
        monthly: filterPlans(defaultPricingPlans.monthly),
        annual: filterPlans(defaultPricingPlans.annual),
        oneTime: defaultPricingPlans.oneTime,
        pricingCardFeatures: filterFeatures(pricingCardFeatures),
        pricingComparisonFeatures: filterFeatures(pricingComparisonFeatures),
    };
};
