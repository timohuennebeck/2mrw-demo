import { Resend } from "resend";
import FreeTrialEmailTemplate from "@/emails/FreeTrialEmailTemplate";
import { emailConfig as actualEmailConfig } from "@/config/emailConfig";
import OnboardingEmail from "@/emails/OnboardingEmail";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_EMAIL_API_KEY ?? "");

interface EmailTemplateProps {
    userEmail: string;
    userFirstName: string;
    purchasedPackage?: string;
}

export enum EmailTemplate {
    FREE_TRIAL = "FREE_TRIAL",
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
                react: FreeTrialEmailTemplate({
                    userFirstName: props.userFirstName,
                    trialSignupLink: `${process.env.NEXT_PUBLIC_SITE_URL}/choose-pricing-plan?welcomeEmail=true`,
                }),
            };

        case EmailTemplate.ONBOARDING:
            if (!settings.onboardingEmail.isEnabled) {
                throw new Error("Onboarding email is disabled");
            }

            return {
                subject: `${settings.onboardingEmail.subject} - ${props.purchasedPackage}`,
                react: OnboardingEmail({
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
