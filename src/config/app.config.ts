interface WidgetConfig {
    isEnabled: boolean;
    formUrl: string;
}

interface GeneralConfig {
    testimonialSidePanel: {
        isEnabled: boolean;
        direction: "left" | "right";
    };
    onboarding: {
        isEnabled: boolean;
        isRequired: boolean;
    };
    feedback: {
        widgets: {
            reportBug: WidgetConfig;
            shareFeedback: WidgetConfig;
            accountDeletion: WidgetConfig;
        };
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

    /**
     * - isEnabled: Controls whether the onboarding flow is active. When enabled, users are directed to "/onboarding"; when disabled, they go to "/app"
     * - isRequired: If true, users must complete onboarding before accessing any protected routes in the application
     */
    onboarding: {
        isEnabled: true,
        isRequired: true,
    },

    feedback: {
        widgets: {
            reportBug: {
                isEnabled: true,
                formUrl: "https://tally.so/r/bug-report",
            },
            shareFeedback: {
                isEnabled: true, // controls the FeedbackWidget.tsx in bottom right
                formUrl: "https://tally.so/r/general-feedback",
            },
            accountDeletion: {
                isEnabled: true, // controls whether to show feedback prompt after account deletion
                formUrl: "https://tally.so/r/exit-survey",
            },
        },
    },
};