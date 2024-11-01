import { PaymentEnums } from "@/enums/PaymentEnums";

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
    paymentType: PaymentEnums;
    subscriptionSettings: SubscriptionSettings;
    oneTimeSettings: OneTimeSettings;
}

export const paymentConfig: CompletePaymentConfig = {
    paymentType: PaymentEnums.ONE_TIME, // set which payment type is active

    // subscription settings: used when paymentType is SUBSCRIPTION
    subscriptionSettings: {
        enableFreeTrial: false,
        freeTrialDays: 0,
        yearlyDiscountPercentage: 20,
    },

    // one-time settings: used when paymentType is ONE_TIME
    oneTimeSettings: {
        enableFreeTrial: false,
        freeTrialDays: 0,
    },
};

// helper functions to get the active settings
export const getCurrentPaymentSettings = () => {
    return paymentConfig.paymentType === PaymentEnums.SUBSCRIPTION
        ? paymentConfig.subscriptionSettings
        : paymentConfig.oneTimeSettings;
};

// helper to check if subscription features are enabled
export const isOneTimePaymentEnabled = () => paymentConfig.paymentType === PaymentEnums.ONE_TIME;
