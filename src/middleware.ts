import { FreeTrialStatus } from "@/enums/FreeTrialStatus";
import { SubscriptionStatus } from "@/enums/SubscriptionStatus";
import { createServerClient } from "@supabase/ssr";
import { NextRequest as nextRequest, NextResponse as nextResponse } from "next/server";
import { SupabaseClient, User } from "@supabase/supabase-js";

const HIDE_ON_PREMIUM_PLAN = ["/choose-pricing-plan"];

const handleRedirection = async ({
    request,
    user,
}: {
    request: nextRequest;
    user: User | null;
}) => {
    // allow all API routes to pass through without additional checks
    if (request.nextUrl.pathname.startsWith("/api")) {
        return nextResponse.next();
    }

    if (request.nextUrl.pathname.startsWith("/auth")) {
        if (user) {
            // redirects authenticated users to the dashboard
            return nextResponse.redirect(new URL("/", request.url));
        }

        // allow non-authenticated users to access auth pages
        return nextResponse.next();
    }

    if (!user) {
        // redirects non-authenticated users to sign-in page
        return nextResponse.redirect(new URL("/auth/sign-in", request.url));
    }

    // user is authenticated and accessing a non-auth route
    return null;
};

const getSubscriptionStatus = async (supabaseClient: SupabaseClient, user: User) => {
    // uses metadata as source of truth to prevent making obessive amounts of api calls whenever the middleware triggers
    if (user?.user_metadata?.subscription_status && user?.user_metadata?.free_trial_status) {
        return {
            subscription_status: user.user_metadata.subscription_status,
            free_trial_status: user.user_metadata.free_trial_status,
        };
    }

    const { data: subscriptionData, error: subscriptionError } = await supabaseClient
        .from("subscriptions")
        .select("status")
        .eq("user_id", user.id)
        .single();

    const { data: freeTrialData, error: freeTrialError } = await supabaseClient
        .from("free_trials")
        .select("status")
        .eq("user_id", user.id)
        .single();

    if (!subscriptionError && !freeTrialError && subscriptionData && freeTrialData) {
        await supabaseClient.auth.updateUser({
            data: {
                subscription_status: subscriptionData.status,
                free_trial_status: freeTrialData.status,
            },
        });

        return {
            subscription_status: subscriptionData.status,
            free_trial_status: freeTrialData.status,
        };
    }

    const fallbackStatus = {
        subscription_status: SubscriptionStatus.NOT_PURCHASED,
        free_trial_status: FreeTrialStatus.NOT_STARTED,
    };

    await supabaseClient.auth.updateUser({ data: fallbackStatus });

    return fallbackStatus;
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
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));

                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options),
                    );
                },
            },
        },
    );

    const {
        data: { user },
    } = await supabaseClient.auth.getUser();

    const routingResponse = await handleRedirection({ request, user });

    if (routingResponse) return routingResponse;

    if (!user) return nextResponse.next();

    const { subscription_status, free_trial_status } = await getSubscriptionStatus(
        supabaseClient,
        user,
    );

    const hasPremiumSubscription = subscription_status === SubscriptionStatus.ACTIVE;
    const isOnFreeTrial = free_trial_status === FreeTrialStatus.ACTIVE;
    const hasPremiumOrFreeTrial = hasPremiumSubscription || isOnFreeTrial;

    const currentPath = request.nextUrl.pathname;

    if (hasPremiumOrFreeTrial) {
        return HIDE_ON_PREMIUM_PLAN.includes(currentPath)
            ? nextResponse.redirect(new URL("/", request.url))
            : nextResponse.next();
    } else {
        return currentPath !== "/choose-pricing-plan"
            ? nextResponse.redirect(new URL("/choose-pricing-plan", request.url))
            : nextResponse.next();
    }
};

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
