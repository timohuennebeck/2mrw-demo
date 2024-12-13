import { EmailType } from "@/enums";
import { EmailConfig } from "@/interfaces";

export const emailConfig: EmailConfig = {
    apiKey: process.env.NEXT_PUBLIC_LOOPS_API_KEY ?? "",
    baseUrl: "https://app.loops.so/api/v1",
    templates: {
        [EmailType.THANK_YOU_FOR_SIGNING_UP]: {
            transactionalId: "clhz2d4x3005abc123def456",
            enabled: true,
            variables: ["name"],
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

        [EmailType.DELETED_USER]: {
            transactionalId: "clhz2d4x3008abc123def456",
            enabled: true,
            variables: ["name"],
        },
    },
};
