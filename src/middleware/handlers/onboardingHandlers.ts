import { appConfig, ROUTES_CONFIG } from "@/config";
import { fetchUser } from "@/services/database/user-service";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { redirectTo } from "./utils";

const _isPlanConfirmationPage = (pathname: string) => {
    return pathname.startsWith("/plan-confirmation");
};

export const handleOnboarding = async (
    request: NextRequest,
    user: SupabaseUser,
) => {
    const { data: dbUser } = await fetchUser(user.id);

    const { isEnabled } = appConfig.onboarding;

    const dashboardRoute = ROUTES_CONFIG.PROTECTED.USER_DASHBOARD;
    const onboardingRoute = ROUTES_CONFIG.PROTECTED.ONBOARDING;

    const isOnboardingPage = request.nextUrl.pathname === onboardingRoute;
    const hasCompletedOnboarding = dbUser?.onboarding_completed;

    if (_isPlanConfirmationPage(request.nextUrl.pathname)) {
        return NextResponse.next({ request }); // exclude plan-confirmation routes from routing
    }

    if (isOnboardingPage && (hasCompletedOnboarding || !isEnabled)) {
        return redirectTo(request, dashboardRoute); // redirect user away from onboarding if completed or disabled
    }
};
