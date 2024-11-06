import { BillingPlan } from "@/interfaces/StripePrices";

interface SubscriptionSettings {
    enableFreeTrial: boolean;
    freeTrialDays: number;
    yearlyDiscountPercentage: number;
}

interface OneTimeSettings {
    enableFreeTrial: boolean;
    freeTrialDays: number;
}

interface CompletePaymentConfig {
    paymentType: BillingPlan;
    isFreePlanEnabled: boolean;
    currency: string;
    subscriptionSettings: SubscriptionSettings;
    oneTimeSettings: OneTimeSettings;
}

export const paymentConfig: CompletePaymentConfig = {
    // TOOD: remove this as we now have billing_plan inside the database
    paymentType: BillingPlan.RECURRING, // set which payment type is active

    /**
     * if free plan is still shown after disabling it, reload the page
     * as it needs to refetch the products from the database
     */

    isFreePlanEnabled: true,
    currency: "EUR",

    // TODO: query the prices from the database where the billing_plan is equal to the billing_plan from the products table and the product_id is equal to the id from the products table

    // subscription settings: used when paymentType is SUBSCRIPTION
    subscriptionSettings: {
        enableFreeTrial: false,
        freeTrialDays: 7,
        yearlyDiscountPercentage: 20,
    },

    // one-time settings: used when paymentType is ONE_TIME
    oneTimeSettings: {
        enableFreeTrial: true,
        freeTrialDays: 7,
    },
};

// helper functions to get the active settings
export const getCurrentPaymentSettings = () => {
    return paymentConfig.paymentType === BillingPlan.RECURRING
        ? paymentConfig.subscriptionSettings
        : paymentConfig.oneTimeSettings;
};

// helper to check if subscription features are enabled
export const isOneTimePaymentEnabled = () => paymentConfig.paymentType === BillingPlan.ONE_TIME;
export const isFreeTrialEnabled = () => getCurrentPaymentSettings().enableFreeTrial;
export const isFreePlanEnabled = () => paymentConfig.isFreePlanEnabled;
export const getCurrency = () => paymentConfig.currency;
