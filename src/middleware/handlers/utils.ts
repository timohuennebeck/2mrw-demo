import { isProtectedRoute, ROUTES_CONFIG } from "@/config";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { handleLoggedInRedirect } from "./authHandlers";

export const redirectTo = (request: NextRequest, path: string) => {
    return NextResponse.redirect(new URL(path, request.url));
};

export const handleRouting = async (
    request: NextRequest,
    user: SupabaseUser,
) => {
    if (!user && isProtectedRoute(request.nextUrl.pathname)) {
        return redirectTo(request, ROUTES_CONFIG.PUBLIC.LANDING_PAGE); // force user to landing page if not authenticated
    }

    return handleLoggedInRedirect(request, user);
};
