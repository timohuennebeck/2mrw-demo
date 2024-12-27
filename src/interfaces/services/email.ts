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

interface WelcomeToEmail {}

interface FreeTrialStartedEmail {
    freeTrialEndDate: string;
}

interface FreeTrialExpiresSoonEmail {
    upgradeUrl: string;
}

interface CancelledSubscriptionEmail {
    endDate: string;
    feedbackFormUrl: string;
}

interface DowngradedToFreePlanEmail {
    upgradeUrl: string;
}

export type EmailVariablesMap = {
    [EmailType.WELCOME_TO_COMPANY_NAME]: WelcomeToEmail;
    [EmailType.FREE_TRIAL_STARTED]: FreeTrialStartedEmail;
    [EmailType.FREE_TRIAL_EXPIRES_SOON]: FreeTrialExpiresSoonEmail;
    [EmailType.CANCELLED_SUBSCRIPTION]: CancelledSubscriptionEmail;
    [EmailType.DOWNGRADED_TO_FREE_PLAN]: DowngradedToFreePlanEmail;
};
