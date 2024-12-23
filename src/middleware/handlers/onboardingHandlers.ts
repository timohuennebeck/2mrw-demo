import { appConfig, ROUTES_CONFIG } from "@/config";
import { fetchUser } from "@/services/database/userService";
import { User as SupabaseUser } from "@supabase/supabase-js";

export const handleOnboarding = async (
    pathname: string,
    user: SupabaseUser,
) => {
    const { data: dbUser } = await fetchUser(user.id);

    const { isEnabled, isRequired } = appConfig.onboarding;

    const dashboardRoute = ROUTES_CONFIG.PROTECTED.USER_DASHBOARD;
    const onboardingRoute = ROUTES_CONFIG.PROTECTED.ONBOARDING;

    const isOnboardingPage = pathname === onboardingRoute;
    const hasCompletedOnboarding = dbUser?.onboarding_completed;

    if (isOnboardingPage && (hasCompletedOnboarding || !isEnabled)) {
        return dashboardRoute; // redirect user away from onboarding if completed or disabled
    }

    if (!isOnboardingPage && !hasCompletedOnboarding && isRequired) {
        return onboardingRoute; // force onboarding if required
    }

    return null;
};
