import { isPublicRoute, ROUTES_CONFIG } from "@/config";
import { User as SupabaseUser } from "@supabase/supabase-js";
import {
    NextRequest as nextRequest,
    NextResponse as nextResponse,
} from "next/server";
import { handleBilling } from "./billingHandlers";
import { handleOnboarding } from "./onboardingHandlers";
import { redirectTo } from "./utils";

export const handleLoggedInRedirect = async (
    request: nextRequest,
    user: SupabaseUser,
) => {
    const { pathname } = request.nextUrl;

    if (isPublicRoute(pathname)) {
        return nextResponse.next({ request });
    }

    if (pathname.startsWith("/auth")) {
        return redirectTo(request, ROUTES_CONFIG.PROTECTED.USER_DASHBOARD); // force user to dashboard if they go to an auth page
    }

    const billingPath = await handleBilling(pathname, user);
    if (billingPath) return redirectTo(request, billingPath);

    const onboardingPath = await handleOnboarding(pathname, user);
    if (onboardingPath) return redirectTo(request, onboardingPath);

    return nextResponse.next({ request }); // allow access to all other routes
};
