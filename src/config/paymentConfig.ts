import { PricingModel } from "@/interfaces/StripePrices";

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
    paymentType: PricingModel;
    currency: string;
    subscriptionSettings: SubscriptionSettings;
    oneTimeSettings: OneTimeSettings;
}

export const paymentConfig: CompletePaymentConfig = {
    // TOOD: remove this as we now have pricing_model inside the database
    paymentType: PricingModel.SUBSCRIPTION, // set which payment type is active
    currency: "EUR",

    // TODO: query the prices from the database where the pricing_model is equal to the pricing_model from the products table and the product_id is equal to the id from the products table

    // subscription settings: used when paymentType is SUBSCRIPTION
    subscriptionSettings: {
        enableFreeTrial: false,
        freeTrialDays: 0,
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
    return paymentConfig.paymentType === PricingModel.SUBSCRIPTION
        ? paymentConfig.subscriptionSettings
        : paymentConfig.oneTimeSettings;
};

// helper to check if subscription features are enabled
export const isOneTimePaymentEnabled = () => paymentConfig.paymentType === PricingModel.ONE_TIME;
export const getCurrency = () => paymentConfig.currency;
