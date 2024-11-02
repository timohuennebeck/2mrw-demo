import { EmailTemplate } from "@/lib/email/emailService";

export const validateEmailProps = (template: EmailTemplate, props: any) => {
    if (!props.userEmail || !props.userFirstName) {
        return { error: "Missing required fields" };
    }

    if (template === EmailTemplate.ONBOARDING && !props.purchasedPackage) {
        return { error: "Missing purchasedPackage field" };
    }

    if (template === EmailTemplate.FREE_TRIAL && !props.freeTrialEndDate) {
        return { error: "Missing freeTrialEndDate field" };
    }

    return { success: true };
};
