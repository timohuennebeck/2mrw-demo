import { EmailTemplate } from "@/lib/email/emailService";

export const validateEmailProps = (template: EmailTemplate, props: any) => {
    if (!props.userEmail || !props.userFirstName) {
        throw new Error("Missing required fields");
    }

    if (template === EmailTemplate.ONBOARDING && !props.purchasedPackage) {
        throw new Error("Missing purchasedPackage field");
    }

    if (template === EmailTemplate.FREE_TRIAL && !props.freeTrialEndDate) {
        throw new Error("Missing freeTrialEndDate field");
    }
};
