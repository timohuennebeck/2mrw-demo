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

interface ThankYouForSigningUpVariables {}

interface PurchasedSubscriptionVariables {
    name: string;
    subscriptionDetails: string;
}

interface CancelledSubscriptionVariables {
    name: string;
    cancellationDetails: string;
}

interface FreeTrialStartedVariables {
    freeTrialEndDate: string;
}

interface FreeTrialExpiresSoonVariables {
    upgradeUrl: string;
}

interface FreeTrialExpiredVariables {
    name: string;
    upgradeUrl: string;
}

interface DeletedUserVariables {
    name: string;
}

export type EmailVariablesMap = {
    [EmailType.THANK_YOU_FOR_SIGNING_UP]: ThankYouForSigningUpVariables;
    [EmailType.PURCHASED_SUBSCRIPTION]: PurchasedSubscriptionVariables;
    [EmailType.CANCELLED_SUBSCRIPTION]: CancelledSubscriptionVariables;
    [EmailType.FREE_TRIAL_STARTED]: FreeTrialStartedVariables;
    [EmailType.FREE_TRIAL_EXPIRES_SOON]: FreeTrialExpiresSoonVariables;
    [EmailType.FREE_TRIAL_EXPIRED]: FreeTrialExpiredVariables;
    [EmailType.DELETED_USER]: DeletedUserVariables;
};
