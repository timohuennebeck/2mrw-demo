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
    subscriptionConfirmationEmail: {
        subject: string;
        isEnabled: boolean;
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
        subscriptionConfirmationEmail: {
            subject: "Order Confirmation",
            isEnabled: true,
        },
    } as EmailSettings,
};
