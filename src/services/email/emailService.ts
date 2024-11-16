import { emailConfig as actualEmailConfig } from "@/config/emailConfig";
import SubscriptionConfirmationEmail from "@/emails/templates/SubscriptionConfirmationEmail";
import { resend } from "./client";
import { EmailTemplate, EmailTemplateProps } from "@/interfaces";

const getEmailConfig = (template: EmailTemplate, props: EmailTemplateProps) => {
    const { settings } = actualEmailConfig;

    switch (template) {
        case EmailTemplate.SUBSCRIPTION_CONFIRMATION:
            if (!settings.subscriptionConfirmationEmail.isEnabled) {
                throw new Error("Subscription confirmation email is disabled");
            }

            return {
                subject: `${settings.subscriptionConfirmationEmail.subject} - ${props.purchasedPackage}`,
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
