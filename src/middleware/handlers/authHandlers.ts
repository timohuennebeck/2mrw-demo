import { isPublicRoute, ROUTES_CONFIG } from "@/config";
import { User as SupabaseUser } from "@supabase/supabase-js";
import {
    NextRequest as nextRequest,
    NextResponse as nextResponse,
} from "next/server";
import { handleBilling } from "./billingHandlers";
import { handleOnboarding } from "./onboardingHandlers";
import { redirectTo } from "./utils";

export const handleLoggedInRedirect = async (request: nextRequest, user: SupabaseUser) => {
    const { pathname } = request.nextUrl;

    if (isPublicRoute(pathname)) {
        return nextResponse.next({ request });
    }

    if (pathname.startsWith("/auth")) {
        return redirectTo(request, ROUTES_CONFIG.PROTECTED.USER_DASHBOARD); // force user to dashboard if they go to an auth page
    }

    const billingResponse = await handleBilling(pathname, request, user);
    if (billingResponse.status !== 200) return billingResponse;

    const onboardingResponse = await handleOnboarding(pathname, request, user);
    if (onboardingResponse.status !== 200) return onboardingResponse;

    return nextResponse.next({ request }); // allow access to all other routes
};
