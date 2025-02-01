import { EmailType } from "@/enums";
import { z } from "zod";
import FreeTrialExpiresEmail from "../../../react-email-starter/emails/free-trial-expires-soon";
import FreeTrialStartedEmail from "../../../react-email-starter/emails/free-trial-started";
import ReferralInviteEmail from "../../../react-email-starter/emails/referral-invite";

export const emailSchemas = {
    [EmailType.FREE_TRIAL_STARTED]: z.object({
        trialDuration: z.number(),
        trialEndDate: z.string(),
    }),
    [EmailType.FREE_TRIAL_EXPIRES_SOON]: z.object({
        trialDuration: z.number(),
        discountCode: z.string(),
    }),
    [EmailType.REFERRAL_INVITE]: z.object({
        nameOfReferrer: z.string(),
        referralCode: z.string(),
    }),
};

export type FreeTrialStartedEmail = z.infer<
    typeof emailSchemas[EmailType.FREE_TRIAL_STARTED]
>;

export type FreeTrialExpiresEmail = z.infer<
    typeof emailSchemas[EmailType.FREE_TRIAL_EXPIRES_SOON]
>;

export type ReferralInviteEmail = z.infer<
    typeof emailSchemas[EmailType.REFERRAL_INVITE]
>;

export const emailRequestSchema = z.object({
    to: z.string().email(),
    subject: z.string(),
    emailType: z.nativeEnum(EmailType),
    variables: z.record(z.string(), z.string()),
});

export type EmailRequest = z.infer<typeof emailRequestSchema>;
