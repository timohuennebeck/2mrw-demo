import { DefaultPricingPlan } from "@/data/marketing/pricing-data";
import { BillingPeriod } from "@/enums";

export const getBillingPeriodText = (billingPeriod: BillingPeriod) => {
    switch (billingPeriod) {
        case BillingPeriod.MONTHLY:
            return "/ MONTH";
        case BillingPeriod.YEARLY:
            return "/ YEAR";
        case BillingPeriod.LIFETIME:
            return " ONE TIME";
    }
};

export const getPlanPriceDescription = (
    plan: DefaultPricingPlan,
    pricePerMonthForYearlyPlan: string | null,
) => {
    if (plan.stripe_price_id === "price_free") {
        return "Free Forever";
    }
    if (plan.billing_period === BillingPeriod.LIFETIME) {
        return "Purchase Once. Forever Yours.";
    }
    return `${pricePerMonthForYearlyPlan} / month when billed per annum`;
};
