import { createServerClient } from "@supabase/ssr";
import { User as SupabaseUser } from "@supabase/supabase-js";
import {
    NextRequest as nextRequest,
    NextResponse as nextResponse,
} from "next/server";
import { appConfig, billingConfig } from "./config";
import {
    isProtectedRoute,
    isPublicRoute,
    ROUTES_CONFIG,
} from "./config/routesConfig";
import { SubscriptionStatus, SubscriptionTier } from "./enums";
import { PurchasedSubscription, User } from "./interfaces";
import { createClient } from "./services/integration/server";
import {
    getCachedSubscription,
    getCachedUser,
    setCachedSubscription,
    setCachedUser,
} from "./services/redis/redisService";

const _getCachedUser = async (userId: string) => {
    try {
        const { data: cachedData } = await getCachedUser(userId);
        if (cachedData) return { data: cachedData, error: null };

        // cache miss - fetch from database
        const supabase = await createClient();

        const { data: user, error: dbError } = await supabase
            .from("users")
            .select("*")
            .eq("id", userId)
            .single();

        if (dbError) return { data: null, error: dbError };

        // cache the new subscription data
        await setCachedUser(userId, user);

        return { data: user as User, error: null };
    } catch (error) {
        console.error("Cache error:", error);
        return { data: null, error };
    }
};

const _getCachedSubscription = async (userId: string) => {
    try {
        const { data: cachedData } = await getCachedSubscription(userId);
        if (cachedData) return { data: cachedData, error: null };

        // cache miss - fetch from database
        const supabase = await createClient();

        const { data: subscription, error: dbError } = await supabase
            .from("user_subscriptions")
            .select("*")
            .eq("user_id", userId)
            .single();

        if (dbError) return { data: null, error: dbError };

        // cache the new subscription data
        await setCachedSubscription(userId, subscription);

        return { data: subscription as PurchasedSubscription, error: null };
    } catch (error) {
        console.error("Cache error:", error);
        return { data: null, error };
    }
};

export const _redirectTo = (request: nextRequest, path: string) => {
    return nextResponse.redirect(new URL(path, request.url));
};

export const _shouldBypassMiddleware = (pathname: string) => {
    return pathname.startsWith("/api");
};

export const _handleOnboarding = async (
    pathname: string,
    request: nextRequest,
    user: SupabaseUser,
) => {
    const { data: userData } = await _getCachedUser(user.id);
    const isOnboardingCompleted = userData?.onboarding_completed;

    const { isEnabled, isRequired } = appConfig.onboarding;

    // hide onboarding if disabled
    if (!isEnabled) return nextResponse.next({ request });

    const onboardingRoute = ROUTES_CONFIG.PROTECTED.ONBOARDING;
    const isOnboardingPage = pathname === onboardingRoute;

    if (!isOnboardingPage && isOnboardingCompleted) {
        return _redirectTo(request, ROUTES_CONFIG.PROTECTED.USER_DASHBOARD); // redirect user away from onboarding if completed
    }

    if (!isOnboardingPage && !isOnboardingCompleted && isRequired) {
        return _redirectTo(request, onboardingRoute); // force onboarding if required
    }

    return nextResponse.next({ request });
};

export const _handleBilling = async (
    pathname: string,
    request: nextRequest,
    user: SupabaseUser,
) => {
    const { isFreePlanEnabled } = billingConfig;

    const dashboardRoute = ROUTES_CONFIG.PROTECTED.USER_DASHBOARD;
    const pricingPlanRoute = ROUTES_CONFIG.PROTECTED.CHOOSE_PRICING_PLAN;

    const isPricingPlanPage = pathname === pricingPlanRoute;

    const { data: subscriptionData } = await _getCachedSubscription(user.id);
    const userPlan = subscriptionData?.subscription_tier;

    const hasPaidPlan = userPlan && userPlan !== SubscriptionTier.FREE;
    const hasFreePlan = userPlan === SubscriptionTier.FREE;
    const isTrialing = subscriptionData?.status === SubscriptionStatus.TRIALING;

    if (isPricingPlanPage && (hasPaidPlan || isTrialing)) {
        return _redirectTo(request, dashboardRoute); // redirect away from pricing page if user has active subscription (not free plan) or active trial
    }

    if (!isPricingPlanPage && !hasPaidPlan && !isTrialing) {
        if (isFreePlanEnabled && !hasFreePlan) {
            return _redirectTo(request, pricingPlanRoute); // force users to pricing page if free plan is enabled and user does not have a free plan
        }

        if (!isFreePlanEnabled) {
            return _redirectTo(request, pricingPlanRoute); // force users to pricing page if they don't have a paid plan or trial
        }
    }

    return nextResponse.next({ request });
};

export const _handleUnauthenticatedRedirect = (
    request: nextRequest,
    pathname: string,
) => {
    if (isProtectedRoute(pathname)) {
        return _redirectTo(request, ROUTES_CONFIG.PUBLIC.LANDING_PAGE); // force user to landing page if not authenticated
    }

    return nextResponse.next({ request });
};

export const _handleLoggedInRedirect = async (
    pathname: string,
    request: nextRequest,
    user: SupabaseUser,
) => {
    if (pathname.startsWith("/auth")) {
        return _redirectTo(request, ROUTES_CONFIG.PROTECTED.USER_DASHBOARD); // force user to dashboard if they go to an auth page
    }

    const onboardingResponse = await _handleOnboarding(pathname, request, user);
    if (onboardingResponse.status !== 200) return onboardingResponse;

    const billingResponse = await _handleBilling(pathname, request, user);
    if (billingResponse.status !== 200) return billingResponse;

    return nextResponse.next({ request }); // allow access to all other routes
};

const _handleRouting = async (request: nextRequest, user: SupabaseUser) => {
    const { pathname } = request.nextUrl;

    if (_shouldBypassMiddleware(pathname)) {
        return nextResponse.next({ request });
    }

    if (isPublicRoute(pathname)) {
        return nextResponse.next({ request });
    }

    if (!user) {
        return _handleUnauthenticatedRedirect(request, pathname);
    }

    return _handleLoggedInRedirect(pathname, request, user);
};

export const middleware = async (request: nextRequest) => {
    let supabaseResponse = nextResponse.next({
        request,
    });

    const supabaseClient = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = nextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        },
    );

    /**
     * IMPORTANT: Don't write any logic between createServerClient and supabase.auth.getUser()
     * because a simple mistake could make it hard to debug and cause issues with users being randomly logged out
     */

    const { data: { user } } = await supabaseClient.auth.getUser();

    const redirectResponse = await _handleRouting(
        request,
        user as SupabaseUser,
    );
    if (redirectResponse) return redirectResponse;

    /**
     * IMPORTANT: When creating a new response, always:
     * 1. Include the request: nextResponse.next({ request })
     * 2. Copy all cookies: newResponse.cookies.setAll(supabaseResponse.cookies.getAll())
     * 3. Return the supabaseResponse object with unchanged cookies to maintain session sync between browser and server
     */

    return supabaseResponse;
};

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
