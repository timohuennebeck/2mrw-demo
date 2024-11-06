import { EmailTemplate } from "@/lib/email/emailService";

export const validateEmailProps = (template: EmailTemplate, props: any) => {
    if (!props.userEmail || !props.userFirstName) {
        return { error: "Missing required fields" };
    }

    if (template === EmailTemplate.SUBSCRIPTION_CONFIRMATION && !props.purchasedPackage) {
        return { error: "Missing purchasedPackage field" };
    }

    return { success: true };
};
