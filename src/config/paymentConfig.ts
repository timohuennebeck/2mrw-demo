import { BillingPlan } from "@/interfaces";

interface CompletePaymentConfig {
    isFreePlanEnabled: boolean;
    currency: string;
    billingPlan: BillingPlan;
    subscriptionSettings: {};
    oneTimeSettings: {};
}

const DEFAULT_CURRENCY = "EUR";

export const paymentConfig: CompletePaymentConfig = {
    /**
     * if free plan is still shown after disabling it, reload the page
     * as it needs to refetch the products from the database
     */
    isFreePlanEnabled: true,
    currency: DEFAULT_CURRENCY,
    billingPlan: BillingPlan.RECURRING,

    /**
     * the subscriptionSettings and oneTimeSettings are work in progress
     * and will be used in the latest update to enable / disable free trials and its duration
     */

    subscriptionSettings: {},
    oneTimeSettings: {},
};

// helper functions to get the active settings
export const getCurrentPaymentSettings = () => {
    return paymentConfig.billingPlan === BillingPlan.RECURRING
        ? paymentConfig.subscriptionSettings
        : paymentConfig.oneTimeSettings;
};

// helper to check if subscription features are enabled
export const isFreePlanEnabled = () => paymentConfig.isFreePlanEnabled;
export const getCurrency = () => paymentConfig.currency;
export const isOneTimePaymentEnabled = () => paymentConfig.billingPlan === BillingPlan.ONE_TIME;
