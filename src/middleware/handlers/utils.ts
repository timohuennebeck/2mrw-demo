import { isProtectedRoute, ROUTES_CONFIG } from "@/config";
import { User as SupabaseUser } from "@supabase/supabase-js";
import {
    NextRequest as nextRequest,
    NextResponse as nextResponse,
} from "next/server";
import { handleLoggedInRedirect } from "./authHandlers";

export const redirectTo = (request: nextRequest, path: string) => {
    return nextResponse.redirect(new URL(path, request.url));
};

export const handleRouting = async (
    request: nextRequest,
    user: SupabaseUser,
) => {
    if (!user && isProtectedRoute(request.nextUrl.pathname)) {
        return redirectTo(request, ROUTES_CONFIG.PUBLIC.LANDING_PAGE); // force user to landing page if not authenticated
    }

    return handleLoggedInRedirect(request, user);
};
