import { EmailType } from "@/enums";

export interface EmailTemplate {
    transactionalId: string;
    enabled: boolean;
    variables: string[];
}

export interface EmailConfig {
    apiKey: string;
    baseUrl: string;
    templates: {
        [K in EmailType]: EmailTemplate;
    };
}

interface ThankYouForSigningUpEmail {}

interface PurchasedSubscriptionEmail {
    name: string;
    subscriptionDetails: string;
}

interface CancelledSubscriptionEmail {
    name: string;
    cancellationDetails: string;
}

interface FreeTrialStartedEmail {
    freeTrialEndDate: string;
}

interface FreeTrialExpiresSoonEmail {
    upgradeUrl: string;
}

interface FreeTrialExpiredEmail {
    name: string;
    upgradeUrl: string;
}

interface DeletedProfileEmail {}

export type EmailVariablesMap = {
    [EmailType.THANK_YOU_FOR_SIGNING_UP]: ThankYouForSigningUpEmail;
    [EmailType.PURCHASED_SUBSCRIPTION]: PurchasedSubscriptionEmail;
    [EmailType.CANCELLED_SUBSCRIPTION]: CancelledSubscriptionEmail;
    [EmailType.FREE_TRIAL_STARTED]: FreeTrialStartedEmail;
    [EmailType.FREE_TRIAL_EXPIRES_SOON]: FreeTrialExpiresSoonEmail;
    [EmailType.FREE_TRIAL_EXPIRED]: FreeTrialExpiredEmail;
    [EmailType.DELETED_PROFILE]: DeletedProfileEmail;
};
