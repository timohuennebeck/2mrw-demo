import { DefaultPricingPlan } from "@/config";
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
