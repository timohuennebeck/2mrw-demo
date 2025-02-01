import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import {
    isProtectedRoute,
    isPublicRoute,
    ROUTES_CONFIG
} from "./config";
import {
    handleCheckReferralCode,
    handleLoggedInRedirect,
} from "./middleware/handlers/authHandlers";
import { redirectTo } from "./middleware/handlers/utils";

const _isPathExcludedFromRouting = (pathname: string) => {
    return pathname.startsWith("/api") || isPublicRoute(pathname);
};

export const middleware = async (request: NextRequest) => {
    let supabaseResponse = NextResponse.next({
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
                    supabaseResponse = NextResponse.next({
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

    // const { data: { user } } = await supabaseClient.auth.getUser();

    // if (_isPathExcludedFromRouting(request.nextUrl.pathname)) {
    //     return NextResponse.next({ request }); // exclude api and public routes from routing
    // }

    // if (!user && isProtectedRoute(request.nextUrl.pathname)) {
    //     return redirectTo(request, ROUTES_CONFIG.PUBLIC.LANDING_PAGE); // force user to landing page if not authenticated
    // }

    // if (user) {
    //     const response = await handleLoggedInRedirect(
    //         request,
    //         user,
    //     );
    //     if (response) return response;
    // }

    // if (request.nextUrl.pathname === "/auth/sign-up") {
    //     const response = await handleCheckReferralCode(request);
    //     console.log("→ [LOG] response", response);
    //     if (response) {
    //         return response;
    //     }
    // }

    /**
     * IMPORTANT: When creating a new response, always:
     * 1. Include the request: NextResponse.next({ request })
     * 2. Copy all cookies: newResponse.cookies.setAll(supabaseResponse.cookies.getAll())
     * 3. Return the supabaseResponse object with unchanged cookies to maintain session sync between browser and server
     */

    return supabaseResponse;
};

export const config = {
    matcher: [
        /*
         * This matches all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */

        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
