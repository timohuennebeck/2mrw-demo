import { PaymentEnum } from "@/enums/PaymentEnum";

interface SubscriptionSettings {
    enableFreeTrial: boolean;
    freeTrialDays: number;
    enableYearlyPlans: boolean;
    yearlyDiscountPercentage: number;
}

interface OneTimeSettings {
    enableFreeTrial: boolean;
    freeTrialDays: number;
}

interface CompletePaymentConfig {
    paymentType: PaymentEnum;
    subscriptionSettings: SubscriptionSettings;
    oneTimeSettings: OneTimeSettings;
}

export const paymentConfig: CompletePaymentConfig = {
    paymentType: PaymentEnum.ONE_TIME, // set which payment type is active

    // subscription settings: used when paymentType is SUBSCRIPTION
    subscriptionSettings: {
        enableFreeTrial: false,
        freeTrialDays: 0,
        enableYearlyPlans: true,
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
    return paymentConfig.paymentType === PaymentEnum.SUBSCRIPTION
        ? paymentConfig.subscriptionSettings
        : paymentConfig.oneTimeSettings;
};

// helper to check if subscription features are enabled
export const isOneTimePaymentEnabled = () => paymentConfig.paymentType === PaymentEnum.ONE_TIME;
