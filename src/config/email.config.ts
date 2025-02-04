import { EmailType } from "@/enums";
import { emailSchemas } from "@/interfaces/services/resend";
import { ReactElement } from "react";
import { z } from "zod";
import FreeTrialExpiresEmail from "../../react-email-starter/emails/free-trial-expires-soon";
import FreeTrialStartedEmail from "../../react-email-starter/emails/free-trial-started";
import ReferralInviteEmail from "../../react-email-starter/emails/referral-invite";

type EmailSchemaType = {
    [K in EmailType]: z.infer<typeof emailSchemas[K]>;
};

type EmailConfigType = {
    [K in EmailType]: {
        component: (props: EmailSchemaType[K]) => ReactElement;
        isEnabled: boolean;
    };
};

export const emailConfig: EmailConfigType = {
    [EmailType.FREE_TRIAL_STARTED]: {
        component: FreeTrialStartedEmail,
        isEnabled: true,
    },
    [EmailType.FREE_TRIAL_EXPIRES_SOON]: {
        component: FreeTrialExpiresEmail,
        isEnabled: true,
    },
    [EmailType.REFERRAL_INVITE]: {
        component: ReferralInviteEmail,
        isEnabled: false,
    },
};
