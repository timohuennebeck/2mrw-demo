import { createServerClient } from "@supabase/ssr";
import { NextRequest as nextRequest, NextResponse as nextResponse } from "next/server";
import { User } from "@supabase/supabase-js";
import { hasUserPremiumOrFreeTrial } from "./lib/helper/subscriptionHelper";

const HIDE_ON_PREMIUM_PLAN = ["/choose-pricing-plan"];

const _handleRedirection = async ({
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
        if (!user) return nextResponse.next(); // allow non-authenticated users to access auth pages

        // redirects authenticated users to the dashboard
        return nextResponse.redirect(new URL("/", request.url));
    }

    if (!user) {
        // redirects non-authenticated users to sign-in page
        return nextResponse.redirect(new URL("/auth/sign-in", request.url));
    }

    // user is authenticated and accessing a non-auth route
    return null;
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

    const routingResponse = await _handleRedirection({ request, user });
    if (routingResponse) return routingResponse;

    if (!user) return nextResponse.next();

    const hasPremiumOrFreeTrial = hasUserPremiumOrFreeTrial(user);
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
