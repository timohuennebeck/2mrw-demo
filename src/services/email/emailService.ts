import { emailConfig as actualEmailConfig } from "@/config/emailConfig";
import PaidPlanEmailConfirmation from "@/emails/templates/PaidPlanEmailConfirmation";
import { resend } from "./client";
import { EmailTemplateProps } from "@/interfaces";
import { EmailTemplate } from "@/enums";

const getEmailConfig = (template: EmailTemplate, props: EmailTemplateProps) => {
    const { settings } = actualEmailConfig;

    switch (template) {
        case EmailTemplate.SUBSCRIPTION_CONFIRMATION:
            if (!settings.paidPlanEmailConfirmation.isEnabled) {
                throw new Error("Subscription confirmation email is disabled");
            }

            return {
                subject: `${settings.paidPlanEmailConfirmation.subject} - ${props.purchasedPackage}`,
                react: PaidPlanEmailConfirmation({
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
