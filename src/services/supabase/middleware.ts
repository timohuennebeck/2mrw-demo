import { createServerClient } from "@supabase/ssr";
import { NextResponse as response, type NextRequest as request } from "next/server";
import { checkFreeTrialStatus, checkPurchasedSubscriptionStatus } from "./queries";
import { SubscriptionStatus } from "@/enums/SubscriptionStatus";
import { FreeTrialStatus } from "@/enums/FreeTrialStatus";

export const updateSession = async (request: request) => {
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
        url.pathname = "/auth/sign-in";
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

    const { status: subscriptionStatus } = await checkPurchasedSubscriptionStatus({
        userId: user?.id ?? "",
    });

    const { status: freeTrialStatus } = await checkFreeTrialStatus({
        userId: user?.id ?? "",
    });

    const hasPremiumSubscription = subscriptionStatus === SubscriptionStatus.ACTIVE ?? false;
    const isOnFreeTrial = freeTrialStatus === FreeTrialStatus.ACTIVE ?? false;
    const hasPremiumOrFreeTrial = hasPremiumSubscription || isOnFreeTrial;

    // non-premium users should be redirected to the choose-pricing-plan page to choose a plan
    if (!hasPremiumOrFreeTrial && request.nextUrl.pathname !== "/choose-pricing-plan") {
        const url = request.nextUrl.clone();
        url.pathname = "/choose-pricing-plan";
        return response.redirect(url);
    }

    // premium users should be redirected away from choose-pricing-plan
    // if (hasPremiumOrFreeTrial && request.nextUrl.pathname === "/choose-pricing-plan") {
    //     const url = request.nextUrl.clone();
    //     url.pathname = "/";
    //     return response.redirect(url);
    // }

    return supabaseResponse;
};
