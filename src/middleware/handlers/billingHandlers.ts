import { ROUTES_CONFIG } from "@/config";
import { SubscriptionStatus, SubscriptionTier } from "@/enums";
import { fetchUserSubscription } from "@/services/database/subscriptionService";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { redirectTo } from "./utils";
import { NextRequest as nextRequest } from "next/server";

export const handleBilling = async (
    request: nextRequest,
    user: SupabaseUser,
) => {
    const { data: subscription } = await fetchUserSubscription(user?.id ?? "");

    const dashboardRoute = ROUTES_CONFIG.PROTECTED.USER_DASHBOARD;
    const pricingPlanRoute = ROUTES_CONFIG.PROTECTED.CHOOSE_PRICING_PLAN;

    const userPlan = subscription?.subscription_tier;

    const isTrialing = subscription?.status === SubscriptionStatus.TRIALING;
    const hasSubscription = userPlan && userPlan !== SubscriptionTier.FREE; // exclude the free plan from being considered a paid plan as it's also saved in users_subscripitions

    const isPricingPlanPage = request.nextUrl.pathname === pricingPlanRoute;

    if (!subscription) {
        return redirectTo(request, pricingPlanRoute);
    }

    if (isPricingPlanPage && (hasSubscription || isTrialing)) {
        return redirectTo(request, dashboardRoute);
    }

    if (!isPricingPlanPage && !hasSubscription && !isTrialing) {
        return redirectTo(request, pricingPlanRoute);
    }
};
