import { billingConfig } from "@/config";
import { ROUTES_CONFIG } from "@/config/routesConfig";
import { SubscriptionStatus, SubscriptionTier } from "@/enums";
import { fetchUserSubscription } from "@/services/database/subscriptionService";
import { User as SupabaseUser } from "@supabase/supabase-js";
import {
    NextRequest as nextRequest,
    NextResponse as nextResponse,
} from "next/server";
import { redirectTo } from "./utils";

export const handleBilling = async (pathname: string, request: nextRequest, user: SupabaseUser) => {
    const { data: subscription } = await fetchUserSubscription(user.id);

    const { isFreePlanEnabled } = billingConfig;

    const dashboardRoute = ROUTES_CONFIG.PROTECTED.USER_DASHBOARD;
    const pricingPlanRoute = ROUTES_CONFIG.PROTECTED.CHOOSE_PRICING_PLAN;

    const userPlan = subscription?.subscription_tier;

    const hasFreePlan = userPlan === SubscriptionTier.FREE;
    const isTrialing = subscription?.status === SubscriptionStatus.TRIALING;
    const hasSubscription = userPlan && userPlan !== SubscriptionTier.FREE; // exclude the free plan from being considered a paid plan as it's also saved in users_subscripitions

    const isPricingPlanPage = pathname === pricingPlanRoute;

    if (isPricingPlanPage && (hasSubscription || isTrialing)) {
        return redirectTo(request, dashboardRoute); // redirect away from pricing page if user has active subscription (not free plan) or active trial
    }

    if (!isPricingPlanPage && !hasSubscription && !isTrialing) {
        if (isFreePlanEnabled && !hasFreePlan) {
            return redirectTo(request, pricingPlanRoute); // force users to pricing page if free plan is enabled and user does not have a free plan
        }

        if (!isFreePlanEnabled) {
            return redirectTo(request, pricingPlanRoute); // force users to pricing page if they don't have a paid plan or trial
        }
    }

    return nextResponse.next({ request });
};
