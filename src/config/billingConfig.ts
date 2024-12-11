import { BillingPlan } from "@/enums";

interface CompletePaymentConfig {
    isFreePlanEnabled: boolean;
    billingPlan: BillingPlan;
}

export const billingConfig: CompletePaymentConfig = {
    isFreePlanEnabled: true, // this will be overridden when ONE_TIME is enabled
    billingPlan: BillingPlan.ONE_TIME,
};

export const isOneTimePaymentEnabled = () => billingConfig.billingPlan === BillingPlan.ONE_TIME;
export const isFreePlanEnabled = () => {
    // free plan should be disabled when ONE_TIME billing is enabled
    if (billingConfig.billingPlan === BillingPlan.ONE_TIME) {
        return false;
    }

    return billingConfig.isFreePlanEnabled;
};
