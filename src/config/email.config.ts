import { EmailType } from "@/enums";
import { EmailConfig } from "@/interfaces";

export const emailConfig: EmailConfig = {
    apiKey: process.env.LOOPS_API_KEY ?? "",
    baseUrl: "https://app.loops.so/api/v1",
    templates: {
        [EmailType.WELCOME_TO_SAAS_NAME]: {
            transactionalId: "YOUR_TRANSACTIONAL_ID",
            enabled: false,
            variables: [],
        },

        [EmailType.FREE_TRIAL_STARTED]: {
            transactionalId: "YOUR_TRANSACTIONAL_ID",
            enabled: false,
            variables: ["freeTrialEndDate"],
        },
        [EmailType.FREE_TRIAL_EXPIRES_SOON]: {
            transactionalId: "YOUR_TRANSACTIONAL_ID",
            enabled: false,
            variables: ["upgradeUrl"],
        },

        [EmailType.CANCELLED_SUBSCRIPTION]: {
            transactionalId: "YOUR_TRANSACTIONAL_ID",
            enabled: false,
            variables: ["endDate, feedbackFormUrl"],
        },

        [EmailType.DOWNGRADED_TO_FREE_PLAN]: {
            transactionalId: "YOUR_TRANSACTIONAL_ID",
            enabled: false,
            variables: ["upgradeUrl"],
        },
    },
};
