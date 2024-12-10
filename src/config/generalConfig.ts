export const generalConfig = {
    authBgImageUrl:
        "https://plus.unsplash.com/premium_photo-1678288606244-71ca32f243f9?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",

    /**
     * if onboarding is enabled, the user will be redirected to the onboarding page
     * if it's not enabled, the user will be redirected to the dashboard
     */
    onboarding: {
        isEnabled: true, // toggle this to enable/disable onboarding
        isRequired: true, // if true, users must complete onboarding before accessing protected routes
    },
};
