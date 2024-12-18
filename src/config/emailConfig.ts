import { EmailType } from "@/enums";
import { EmailConfig } from "@/interfaces";

export const emailConfig: EmailConfig = {
    apiKey: process.env.NEXT_PUBLIC_LOOPS_API_KEY ?? "",
    baseUrl: "https://app.loops.so/api/v1",
    templates: {
        [EmailType.THANK_YOU_FOR_SIGNING_UP]: {
            transactionalId: "cm4u5kfkr01ndtne19byktd2p",
            enabled: true,
            variables: [],
        },

        [EmailType.PURCHASED_SUBSCRIPTION]: {
            transactionalId: "clhz2d4x3002abc123def456",
            enabled: true,
            variables: ["name", "subscriptionDetails"],
        },
        [EmailType.CANCELLED_SUBSCRIPTION]: {
            transactionalId: "clhz2d4x3006abc123def456",
            enabled: true,
            variables: ["name", "cancellationDetails"],
        },

        [EmailType.FREE_TRIAL_STARTED]: {
            transactionalId: "cm4tj86wt04nr1wqrf4yc0lew",
            enabled: true,
            variables: ["freeTrialEndDate"],
        },
        [EmailType.FREE_TRIAL_EXPIRES_SOON]: {
            transactionalId: "clhz2d4x3007abc123def456",
            enabled: true,
            variables: ["name", "upgradeUrl"],
        },
        [EmailType.FREE_TRIAL_EXPIRED]: {
            transactionalId: "clhz2d4x3007abc123def456",
            enabled: true,
            variables: ["name", "upgradeUrl"],
        },

        [EmailType.DELETED_PROFILE]: {
            transactionalId: "cm4u5viv401s082jmhwmlrln1",
            enabled: true,
            variables: [],
        },
    },
};
