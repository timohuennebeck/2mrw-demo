import { createServerClient } from "@supabase/ssr";
import { NextResponse as response, type NextRequest as request } from "next/server";
import { checkFreeTrialStatus, checkSubscriptionStatus } from "./queries";
import { endUserFreeTrial } from "./admin";

export async function updateSession(request: request) {
    let supabaseResponse = response.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));

                    supabaseResponse = response.next({
                        request,
                    });

                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options),
                    );
                },
            },
        },
    );

    // IMPORTANT: avoid writing any logic between createServerClient and supabase.auth.getUser()
    // a minor mistakes can lead to logging out the user

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // checks if the request is for an API route
    const apiRoute = request.nextUrl.pathname.startsWith("/api");

    // redirects non-authenticated users if it's not an API route and the user isn't on an auth page
    if (!user && !apiRoute && !request.nextUrl.pathname.startsWith("/auth")) {
        const url = request.nextUrl.clone();
        url.pathname = "/auth/signIn";
        return response.redirect(url);
    }

    // redirects authenticated users to home page if they try to access auth pages
    if (user && request.nextUrl.pathname.startsWith("/auth")) {
        const url = request.nextUrl.clone();
        url.pathname = "/";
        return response.redirect(url);
    }

    // do NOT move this above the api routes because this would block the api from calling
    if (!user) {
        return supabaseResponse;
    }

    const { subscription, error: subscriptionError } = await checkSubscriptionStatus({
        userId: user?.id ?? "",
    });

    if (subscriptionError) {
        console.error("Error checking subscription:", subscriptionError);
        return { hasPremium: false, error: "Failed to check subscription status" };
    }

    const { freeTrial, error: freeTrialError } = await checkFreeTrialStatus({ userId: user.id });

    if (freeTrialError) {
        console.error("Error checking free trial:", freeTrialError);
        return { hasOnGoingFreeTrial: false, error: "Failed to check free trial status" };
    }

    const hasPremiumSubscription = subscription?.has_premium ?? false;
    const hasOnGoingFreeTrial = freeTrial?.is_active ?? false;

    if (hasOnGoingFreeTrial) {
        const isPastFreeTrialEndDate = freeTrial && freeTrial?.end_date > new Date().toISOString();

        if (isPastFreeTrialEndDate) {
            const { success, error } = await endUserFreeTrial({ supabase, userId: user.id });

            if (error) {
                console.error("Error ending free trial");
            }

            if (success) {
                console.log("Free trial has been ended");
            }
        }
    }

    // non-premium users should be redirected to the choosePricingPlan page to choose a plan
    if (!hasPremiumSubscription && request.nextUrl.pathname !== "/choosePricingPlan") {
        const url = request.nextUrl.clone();
        url.pathname = "/choosePricingPlan";
        return response.redirect(url);
    }

    // premium users should be redirected away from choosePricingPlan
    if (hasPremiumSubscription && request.nextUrl.pathname === "/choosePricingPlan") {
        const url = request.nextUrl.clone();
        url.pathname = "/";
        return response.redirect(url);
    }

    return supabaseResponse;
}
