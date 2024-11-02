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
        template: any;
    };
    freeTrialReminderEmail: {
        subject: string;
        isEnabled: boolean;
    };
    onboardingEmail: {
        subject: string;
        isEnabled: boolean;
        gettingStartedLoomUrl: string;
        template: any;
    };
}

const COMPANY_NAME = "2mrw";

export const emailConfig = {
    companyInformation: {
        name: COMPANY_NAME,
        supportEmail: "contact@joinforj.com",
        senderEmail: "info@updates.joinforj.com",
        logoUrl: "https://framerusercontent.com/images/XmxX3Fws7IH91jzhxBjAhC9CrPM.svg",
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
            subject: `Welcome to ${COMPANY_NAME}!`,
            isEnabled: true,
        },
        freeTrialReminderEmail: {
            subject: "Your free trial is ending soon!",
            isEnabled: true,
        },
        onboardingEmail: {
            subject: "Order Confirmation",
            isEnabled: true,
            gettingStartedLoomUrl: "https://www.loom.com/share/1234567890?sid=1234567890",
        },
    } as EmailSettings,
};
