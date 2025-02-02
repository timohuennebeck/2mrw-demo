interface WidgetConfig {
    isEnabled: boolean;
    formUrl: string;
}

interface GeneralConfig {
    testimonialSidePanel: {
        isEnabled: boolean;
        direction: "left" | "right";
    };
    customerSupport: {
        isEnabled: boolean;
        websiteId: string;
    };
    onboarding: {
        isEnabled: boolean;
        checklist: {
            isEnabled: boolean;
            direction: "left" | "right";
        };
    };
    themeToggle: {
        isEnabled: boolean;
        defaultTheme: "system" | "light" | "dark";
    };
    feedback: {
        bugReport: {
            isEnabled: boolean;
            formUrl: string;
        };
        featureRequest: {
            isEnabled: boolean;
            formUrl: string;
        };
        forms: {
            accountDeletion: WidgetConfig;
        };
    };
    company: {
        name: string;
        contactEmail: string;
        senderEmail: string;
    };
}

export const appConfig: GeneralConfig = {
    /**
     * - isEnabled: Controls whether the testimonial side panel on the auth pages is enabled. When enabled, the side panel is displayed on the right side of the screen
     * - direction: Controls the direction of the side panel. Can be "left" or "right"
     */
    testimonialSidePanel: {
        isEnabled: true,
        direction: "right",
    },

    customerSupport: {
        isEnabled: false,
        websiteId: "YOUR_CRISP_WEBSITE_ID",
    },

    /**
     * - isEnabled: Controls whether the onboarding flow is active. When enabled, users are directed to "/onboarding"; when disabled, they go to "/app"
     */
    onboarding: {
        isEnabled: true,
        checklist: {
            isEnabled: true,
            direction: "left",
        },
    },

    themeToggle: {
        isEnabled: true,
        defaultTheme: "dark",
    },

    feedback: {
        bugReport: {
            isEnabled: true,
            formUrl: "https://tally.so/r/bug-report",
        },
        featureRequest: {
            isEnabled: true,
            formUrl: "https://tally.so/r/feature-request",
        },
        forms: {
            accountDeletion: {
                isEnabled: true, // controls whether to show feedback prompt after account deletion
                formUrl: "https://tally.so/r/exit-survey",
            },
        },
    },

    company: {
        name: "2mrw",
        contactEmail: "support@example.com",
        senderEmail: "m@example.com", // this email is used as the sender email for all outgoing emails such as freeTrialStarted, etc.
    },
};
