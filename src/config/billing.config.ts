import { BillingPlan } from "@/enums";

interface CompletePaymentConfig {
    isFreePlanEnabled: boolean;
    billingPlan: BillingPlan;
    freeTrial: {
        isEnabled: boolean;
        duration: number;
    };
}

/**
 * always only use isFreePlanEnabled() and isOneTimePaymentEnabled() when checking the statuses
 * simply accessing freeTrial.isEnabled could lead to issues if the BillingPlan.ONE_TIME is enabled
 */

export const billingConfig: CompletePaymentConfig = {
    isFreePlanEnabled: false, // this will be overridden when ONE_TIME is enabled
    billingPlan: BillingPlan.RECURRING,

    // only used when RECURRING billing is enabled
    freeTrial: {
        isEnabled: true,
        duration: 14,
    },
};

export const isOneTimePaymentEnabled = () => {
    return billingConfig.billingPlan === BillingPlan.ONE_TIME;
};

export const isFreePlanEnabled = () => {
    if (isOneTimePaymentEnabled()) return false; // free plan is forced to be disabled when ONE_TIME billing is enabled

    return billingConfig.isFreePlanEnabled;
};

export const isFreeTrialEnabled = () => {
    if (isOneTimePaymentEnabled()) return false; // free trial is forced to be disabled when ONE_TIME billing is enabled

    return billingConfig.freeTrial.isEnabled;
};
