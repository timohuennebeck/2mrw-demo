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

    feedback: {
        widgets: {
            floatingButton: {
                isEnabled: true, // controls the FeedbackWidget.tsx in bottom right
                formUrl: "https://tally.so/r/general-feedback",
            },
            accountDeletion: {
                isEnabled: true, // controls whether to show feedback prompt after account deletion
                formUrl: "https://tally.so/r/exit-survey",
            },
        },
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
