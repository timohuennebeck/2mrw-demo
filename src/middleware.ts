import { createServerClient } from "@supabase/ssr";
import { NextRequest as nextRequest, NextResponse as nextResponse } from "next/server";
import { User } from "@supabase/supabase-js";
import { appConfig } from "./config";

const PUBLIC_ROUTES = [
    "/",
    "/auth/sign-in",
    "/auth/sign-up",
    "/auth/forgot-password",
    "/auth/update-password",
    "/auth/email-confirmation",
    "/auth-error",
    "/user-profile",
    "/auth/password-confirmation",
    "/auth/confirmation",
];

const AUTH_ROUTES = ["/auth/confirm", "/auth/callback", "/auth/email-change"];

const PROTECTED_ROUTES = [
    "/dashboard",
    "/onboarding",
    "/choose-pricing-plan",
    "/plan-confirmation",
];

const _handleOnboardingRedirection = (request: nextRequest, pathname: string, user: User) => {
    const onboardingCompleted = !!user.user_metadata?.onboarding_completed;
    const { isRequired } = appConfig.onboarding;

    // if trying to access onboarding when it's already completed
    if (pathname === "/onboarding" && onboardingCompleted) {
        return nextResponse.redirect(new URL("/dashboard", request.url));
    }

    const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

    // if onboarding is not completed and trying to access other protected routes
    if (pathname !== "/onboarding" && !onboardingCompleted && isProtectedRoute && isRequired) {
        return nextResponse.redirect(new URL("/onboarding", request.url));
    }

    return nextResponse.next();
};

const _handleRedirection = async (request: nextRequest, user: User | null) => {
    const { pathname } = request.nextUrl;

    // allow all api routes to pass through without additional checks, otherwise the api calls would be blocked
    if (pathname.startsWith("/api")) {
        return nextResponse.next({ request });
    }

    // allow access to public routes
    if (PUBLIC_ROUTES.includes(pathname)) {
        return nextResponse.next({ request });
    }

    // allow special auth routes needed for email confirmation etc.
    if (AUTH_ROUTES.includes(pathname)) {
        return nextResponse.next({ request });
    }

    // if user is not logged in
    if (!user) {
        // if trying to access protected routes, redirect to landing page
        if (PROTECTED_ROUTES.includes(pathname)) {
            return nextResponse.redirect(new URL("/", request.url));
        }

        // allow access to auth routes
        if (AUTH_ROUTES.includes(pathname)) {
            return nextResponse.next({ request });
        }

        // for any other routes, redirect to landing page
        return nextResponse.redirect(new URL("/", request.url));
    }

    if (user) {
        const { isEnabled } = appConfig.onboarding;

        // skip onboarding checks if it's disabled
        if (!isEnabled) {
            return nextResponse.next();
        }

        return _handleOnboardingRedirection(request, pathname, user);
    }

    return nextResponse.next();
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

    const redirectResponse = await _handleRedirection(request, user);
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
