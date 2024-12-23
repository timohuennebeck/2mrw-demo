import { ROUTES_CONFIG } from "@/config";
import { SubscriptionStatus, SubscriptionTier } from "@/enums";
import { fetchUserSubscription } from "@/services/database/subscriptionService";
import { User as SupabaseUser } from "@supabase/supabase-js";

export const handleBilling = async (
    pathname: string,
    user: SupabaseUser,
) => {
    const { data: subscription } = await fetchUserSubscription(user?.id ?? "");

    const dashboardRoute = ROUTES_CONFIG.PROTECTED.USER_DASHBOARD;
    const pricingPlanRoute = ROUTES_CONFIG.PROTECTED.CHOOSE_PRICING_PLAN;

    const userPlan = subscription?.subscription_tier;

    const isTrialing = subscription?.status === SubscriptionStatus.TRIALING;
    const hasSubscription = userPlan && userPlan !== SubscriptionTier.FREE; // exclude the free plan from being considered a paid plan as it's also saved in users_subscripitions

    const isPricingPlanPage = pathname === pricingPlanRoute;

    if (isPricingPlanPage && (hasSubscription || isTrialing)) {
        return dashboardRoute; // redirect away from pricing page if user has active subscription (not free plan) or active trial
    }

    if (!isPricingPlanPage && !hasSubscription && !isTrialing) {
        return pricingPlanRoute; // force users to pricing page if they don't have a paid plan or trial
    }

    return null;
};
