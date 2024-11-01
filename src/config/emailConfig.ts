import FreeTrialEmailTemplate from "@/emails/FreeTrialEmailTemplate";
import PaidPlanEmailTemplate from "@/emails/PaidPlanEmailTemplate";

interface SocialLinks {
    twitter: {
        founder: {
            url: string;
            tag: string;
        };
        company: {
            url: string;
            tag: string;
        };
    };
}

interface CompanyInfo {
    name: string;
    supportEmail: string;
    senderEmail: string;
    logoUrl: string;
}

interface EmailSettings {
    freeTrialEmail: {
        subject: string;
        isEnabled: boolean;
        freeTrialDuration: number;
        template: any;
    };
    postPurchaseEmail: {
        subject: string;
        isEnabled: boolean;
        template: any;
    };
}

export const emailConfig = {
    companyInformation: {
        name: "2mrw",
        supportEmail: "contact@joinforj.com",
        senderEmail: "info@updates.joinforj.com",
        logoUrl: process.env.NEXT_PUBLIC_EMAIL_LOGO_BASE_URL,
    } as CompanyInfo,

    socialLinks: {
        twitter: {
            founder: {
                url: "www.x.com/timohuennebeck",
                tag: "@timohuennebeck",
            },
            company: {
                url: "www.x.com/joinforj",
                tag: "@joinforj",
            },
        },
    } as SocialLinks,

    settings: {
        freeTrialEmail: {
            subject: "Welcome to Your Free Trial!",
            isEnabled: false,
            freeTrialDuration: 7,
            template: FreeTrialEmailTemplate,
        },
        postPurchaseEmail: {
            subject: "Order Confirmation",
            isEnabled: false,
            template: PaidPlanEmailTemplate,
        },
    } as EmailSettings,
};
