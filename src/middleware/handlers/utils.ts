import { isProtectedRoute, ROUTES_CONFIG } from "@/config/routesConfig";
import { User as SupabaseUser } from "@supabase/supabase-js";
import {
    NextRequest as nextRequest,
    NextResponse as nextResponse,
} from "next/server";
import { handleLoggedInRedirect } from "./authHandlers";

export const isPathExcludedFromRouting = (pathname: string) => {
    return pathname.startsWith("/api");
};

export const redirectTo = (request: nextRequest, path: string) => {
    return nextResponse.redirect(new URL(path, request.url));
};

export const handleRouting = async (request: nextRequest, user: SupabaseUser) => {
    const { pathname } = request.nextUrl;

    if (isPathExcludedFromRouting(pathname)) {
        return nextResponse.next({ request }); // exclude api routes from routing
    }

    if (!user && isProtectedRoute(pathname)) {
        return redirectTo(request, ROUTES_CONFIG.PUBLIC.LANDING_PAGE); // force user to landing page if not authenticated
    }

    return handleLoggedInRedirect(request, user);
};
