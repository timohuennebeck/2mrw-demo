import { ROUTES_CONFIG } from "@/config";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { handleBilling } from "./billingHandlers";
import { handleOnboarding } from "./onboardingHandlers";
import { redirectTo } from "./utils";
import { referralCodeExists } from "@/services/database/referral-service";

export const handleLoggedInRedirect = async (
    request: NextRequest,
    user: SupabaseUser,
) => {
    const { pathname } = request.nextUrl;

    if (pathname.startsWith("/auth")) {
        return redirectTo(request, ROUTES_CONFIG.PROTECTED.USER_DASHBOARD); // force user to dashboard if they go to an auth page
    }

    const pricingPlanRoute = ROUTES_CONFIG.PROTECTED.CHOOSE_PRICING_PLAN;
    const isPricingPlanPage = pathname === pricingPlanRoute;

    if (!isPricingPlanPage) {
        const billingResponse = await handleBilling(request, user);
        if (billingResponse) return billingResponse;

        const onboardingResponse = await handleOnboarding(request, user);
        if (onboardingResponse) return onboardingResponse;
    }

    return NextResponse.next({ request }); // allow access to all other routes
};

export const handleCheckReferralCode = async (request: NextRequest) => {
    const { searchParams } = request.nextUrl;

    const authMethodString = searchParams.get("method");
    if (!authMethodString) return null;

    // assuming the method and referral code are separated by ':'
    const [_method, ...rest] = authMethodString.split(":");
    const referralCode = rest.join(":").split("=")[1]; // e.g., "ref=ZA745FHZU"

    if (referralCode) {
        const { codeExists } = await referralCodeExists(referralCode);
        if (!codeExists) {
            const url = request.nextUrl.clone();
            url.searchParams.set("method", "magic-link");
            return NextResponse.redirect(url);
        }
    }

    return null;
};
