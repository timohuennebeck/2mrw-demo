import { EmailType } from "@/enums";
import { EmailConfig } from "@/interfaces";

export const emailConfig: EmailConfig = {
    [EmailType.FREE_TRIAL_STARTED]: {
        enabled: false,
        variables: ["freeTrialEndDate"],
    },
    [EmailType.FREE_TRIAL_EXPIRES_SOON]: {
        enabled: false,
        variables: ["upgradeUrl"],
    },
};
