export const appConfig = {
    /**
     * - isEnabled: Controls whether the side panel is shown or hidden
     */
    auth: {
        sidePanel: {
            isEnabled: true,
        },
    },

    /**
     * - isEnabled: Controls whether the onboarding flow is active. When enabled, users are directed to onboarding; when disabled, they go to dashboard
     * - isRequired: If true, users must complete onboarding before accessing any protected routes in the application
     */
    onboarding: {
        isEnabled: true,
        isRequired: true,
    },

    feedback: {
        isEnabled: true,
        formUrl: "https://tally.so/r/yourform",
    },

    companyInformation: {
        name: "2mrw",
        supportEmail: "contact@joinforj.com",
        senderEmail: "info@updates.joinforj.com",
        logoUrl: "https://framerusercontent.com/images/XmxX3Fws7IH91jzhxBjAhC9CrPM.svg",
    },

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
    },
};
