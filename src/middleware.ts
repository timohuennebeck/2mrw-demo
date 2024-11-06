import { createServerClient } from "@supabase/ssr";
import { NextRequest as nextRequest, NextResponse as nextResponse } from "next/server";
import { User } from "@supabase/supabase-js";
import { hasUserPremiumPlan } from "./lib/helper/SubscriptionHelper";

const HIDE_ON_PREMIUM_PLAN = ["/choose-pricing-plan"];

const _handleRedirection = async (request: nextRequest, user: User | null) => {
    /**
     * allow all api routes to pass through without additional checks
     * otherwise, the api calls would be blocked
     */

    if (request.nextUrl.pathname.startsWith("/api")) {
        return nextResponse.next({ request });
    }

    /**
     * if a user is accessing an auth page and is authenticated, redirect them to the dashboard
     * otherwise, allow non-authenticated users to access auth pages (e.g. sign-in, sign-up, forgot-password, etc.)
     */

    if (request.nextUrl.pathname.startsWith("/auth")) {
        return user
            ? nextResponse.redirect(new URL("/", request.url))
            : nextResponse.next({ request });
    }

    // if user is not authenticated, force them to be redirected to the sign-in page regardless of route
    if (!user) {
        return nextResponse.redirect(new URL("/auth/sign-in", request.url));
    }

    // user is authenticated and accessing a non-auth route
    return nextResponse.next({ request });
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
                    supabaseResponse = nextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options),
                    );
                },
            },
        },
    );

    /**
     * IMPORTANT: Don't write any logic between createServerClient and supabase.auth.getUser()
     * because a simple mistake could make it hard to debug and cause issues with users being randomly logged out
     */

    const {
        data: { user },
    } = await supabaseClient.auth.getUser();

    const routingResponse = await _handleRedirection(request, user);
    if (routingResponse) return routingResponse;

    const hasPremiumPlan = hasUserPremiumPlan(user);
    const currentPath = request.nextUrl.pathname;
    const isPricingPlanPage = currentPath === "/choose-pricing-plan";

    /**
     * if user is not on a premium plan, redirect them to the pricing plan page
     * if user is on a premium plan, allow them to access the page if it's not in the HIDE_ON_PREMIUM_PLAN const
     */

    let response;
    if (hasPremiumPlan) {
        response = isPricingPlanPage
            ? nextResponse.next({ request })
            : nextResponse.redirect(new URL("/choose-pricing-plan", request.url));
    } else {
        const shouldHideCurrentPage = HIDE_ON_PREMIUM_PLAN.includes(currentPath);
        response = shouldHideCurrentPage
            ? nextResponse.redirect(new URL("/", request.url))
            : nextResponse.next({ request });
    }

    /**
     * IMPORTANT: When creating a new response, always:
     * 1. Include the request: nextResponse.next({ request })
     * 2. Copy all cookies: newResponse.cookies.setAll(supabaseResponse.cookies.getAll())
     * 3. Return the supabaseResponse object with unchanged cookies to maintain session sync between browser and server
     */

    return response;
};

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
