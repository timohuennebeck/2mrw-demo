import { BillingPlan } from "@/enums";

interface CompletePaymentConfig {
    isFreePlanEnabled: boolean;
    billingPlan: BillingPlan;
    freeTrial: {
        isEnabled: boolean;
        duration: number;
    };
}

export const billingConfig: CompletePaymentConfig = {
    isFreePlanEnabled: true, // this will be overridden when ONE_TIME is enabled
    billingPlan: BillingPlan.RECURRING,

    // only used when RECURRING billing is enabled
    freeTrial: {
        isEnabled: true,
        duration: 14,
    },
};

export const isOneTimePaymentEnabled = () => billingConfig.billingPlan === BillingPlan.ONE_TIME;
export const isFreePlanEnabled = () => {
    // free plan should be disabled when ONE_TIME billing is enabled
    if (billingConfig.billingPlan === BillingPlan.ONE_TIME) {
        return false;
    }

    return billingConfig.isFreePlanEnabled;
};
