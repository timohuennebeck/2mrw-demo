export const ROUTES_CONFIG = {
    PUBLIC: {
        LANDING_PAGE: "/",
        STATUS_ERROR: "/auth-status/error",
        STATUS_SUCCESS: "/auth-status/success",
    },

    AUTH: {
        SIGN_IN: "/auth/sign-in",
        SIGN_UP: "/auth/sign-up",

        /**
         * the following routes are (password-management) routes
         * these are used for password management flows such as forgot password and update password
         */

        FORGOT_PASSWORD: "/auth/forgot-password",
        UPDATE_PASSWORD: "/auth/update-password",

        /**
         * the following routes are (handlers) routes
         * these are used for handling authentication flows such as email and google login
         */

        CONFIRM: "/auth/confirm",
        CALLBACK: "/auth/callback",
    },

    PROTECTED: {
        USER_DASHBOARD: "/app",
        USER_BILLING: "/app/billing",
        USER_PROFILE: "/app/user-profile",

        /**
         * the following routes are (standalone) routes
         * these do not contain a layout unlike the other protected routes
         */

        CHOOSE_PRICING_PLAN: "/choose-pricing-plan",
        ONBOARDING: "/onboarding",
        PLAN_CONFIRMATION: "/plan-confirmation",
    },
} as const;

export const isPublicRoute = (pathname: string) => {
    const publicRoutes = Object.values(ROUTES_CONFIG.PUBLIC);
    return publicRoutes.some((route) => {
        // exact match for root path, otherwise it would also return true for pages like /onboarding, etc. - which we don't want
        if (route === "/") return pathname === "/";
        return pathname.startsWith(route);
    });
};

// for protected routes, we want to match ANY route that STARTS with the base path
export const isProtectedRoute = (pathname: string) => {
    const protectedRoutes = Object.values(ROUTES_CONFIG.PROTECTED);
    return protectedRoutes.some((route) => pathname.startsWith(route));
};
