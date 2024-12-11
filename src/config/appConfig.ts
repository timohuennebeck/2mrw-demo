export const appConfig = {
    /**
     * - backgroundEnabled: Controls whether the side panel background image is shown
     * - backgroundUrl: URL for the side panel background image
     */
    auth: {
        sidePanel: {
            backgroundEnabled: true,
            backgroundUrl:
                "https://plus.unsplash.com/premium_photo-1678288606244-71ca32f243f9?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
};
