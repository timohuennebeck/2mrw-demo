import { Resend } from "resend";
import { emailConfig as actualEmailConfig } from "@/config/emailConfig";
import SubscriptionConfirmationEmail from "@/emails/SubscriptionConfirmationEmail";
import FreeTrialEmail from "@/emails/FreeTrialEmail";
import FreeTrialReminder from "@/emails/FreeTrialReminder";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_EMAIL_API_KEY ?? "");

interface EmailTemplateProps {
    userEmail: string;
    userFirstName: string;
    purchasedPackage?: string;
    freeTrialEndDate?: string;
    upgradeUrl?: string;
}

export enum EmailTemplate {
    FREE_TRIAL = "FREE_TRIAL",
    FREE_TRIAL_REMINDER = "FREE_TRIAL_REMINDER",
    ONBOARDING = "ONBOARDING",
}

const getEmailConfig = (template: EmailTemplate, props: EmailTemplateProps) => {
    const { settings } = actualEmailConfig;

    switch (template) {
        case EmailTemplate.FREE_TRIAL:
            if (!settings.freeTrialEmail.isEnabled) {
                throw new Error("Free trial email is disabled");
            }

            return {
                subject: settings.freeTrialEmail.subject,
                react: FreeTrialEmail({
                    userFirstName: props.userFirstName,
                    freeTrialEndDate: props.freeTrialEndDate!,
                }),
            };

        case EmailTemplate.FREE_TRIAL_REMINDER:
            if (!settings.freeTrialReminderEmail.isEnabled) {
                throw new Error("Free trial reminder email is disabled");
            }

            return {
                subject: settings.freeTrialReminderEmail.subject,
                react: FreeTrialReminder({
                    userFirstName: props.userFirstName,
                    freeTrialEndDate: props.freeTrialEndDate!,
                    upgradeUrl: props.upgradeUrl!,
                }),
            };

        case EmailTemplate.ONBOARDING:
            if (!settings.onboardingEmail.isEnabled) {
                throw new Error("Onboarding email is disabled");
            }

            return {
                subject: `${settings.onboardingEmail.subject} - ${props.purchasedPackage}`,
                react: SubscriptionConfirmationEmail({
                    userFirstName: props.userFirstName,
                    purchasedPackage: props.purchasedPackage!,
                }),
            };
    }
};

export const sendEmail = async (template: EmailTemplate, props: EmailTemplateProps) => {
    try {
        const emailConfig = getEmailConfig(template, props);

        const { data, error } = await resend.emails.send({
            from: actualEmailConfig.companyInformation.senderEmail,
            to: props.userEmail,
            ...emailConfig,
        });

        if (error) {
            console.error("Failed to send email:", error);
            throw new Error("Email sending failed");
        }

        return { data, error: null };
    } catch (error) {
        console.error("Unexpected error while sending email:", error);
        return { data: null, error: "Failed to send email" };
    }
};
