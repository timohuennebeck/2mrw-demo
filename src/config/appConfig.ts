export const appConfig = {
    /**
     * - isEnabled: Controls whether the testimonial side panel on the auth pages is enabled. When enabled, the side panel is displayed on the right side of the screen
     * - direction: Controls the direction of the side panel. Can be "left" or "right"
     */
    testimonialSidePanel: {
        isEnabled: true,
        direction: "right",
    },

    /**
     * - isEnabled: Controls whether the onboarding flow is active. When enabled, users are directed to "/onboarding"; when disabled, they go to "/dashboard"
     * - isRequired: If true, users must complete onboarding before accessing any protected routes in the application
     */
    onboarding: {
        isEnabled: true,
        isRequired: false,
    },

    /**
     * - isEnabled: Controls whether the feedback form is enabled. When enabled, users are redirected to the feedback form when they click the "Feedback" button in the bottom right corner of the screen
     * - formUrl: The URL of the feedback form
     */
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
