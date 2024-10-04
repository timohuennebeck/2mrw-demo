import { FreeTrialStatus } from "@/enums/FreeTrialStatus";
import { SubscriptionStatus } from "@/enums/SubscriptionStatus";
import { createServerClient } from "@supabase/ssr";
import { NextRequest as nextRequest, NextResponse as nextResponse } from "next/server";
import {
    checkFreeTrialStatus,
    checkPurchasedSubscriptionStatus,
} from "./services/supabase/queries";
import { SupabaseClient, User } from "@supabase/supabase-js";
import moment from "moment";

const ONE_HOUR = 1;
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

const checkUpdateSubscriptionStatus = async ({
    supabaseClient,
    user,
}: {
    supabaseClient: SupabaseClient;
    user: User;
}) => {
    const [purchasedSubscription, freeTrial] = await Promise.all([
        checkPurchasedSubscriptionStatus({ userId: user.id }),
        checkFreeTrialStatus({ userId: user.id }),
    ]);

    const updatedStatus = {
        subscriptionStatus: purchasedSubscription.status,
        freeTrialStatus: freeTrial.status,
        lastStatusCheck: new Date(),
    };

    // update user metadata with new status and timestamp
    await supabaseClient.auth.updateUser({ data: updatedStatus });

    return updatedStatus;
};

const hasOneHourPassed = ({ user }: { user: User }) => {
    const startTime = moment(user?.user_metadata?.lastStatusCheck);
    const currentTime = moment();

    return currentTime.diff(startTime, "hours") >= ONE_HOUR;
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

    let { subscriptionStatus, freeTrialStatus } = user.user_metadata;

    if (hasOneHourPassed({ user })) {
        ({ subscriptionStatus, freeTrialStatus } = await checkUpdateSubscriptionStatus({
            supabaseClient,
            user,
        }));
    }

    if (true) {
        ({ subscriptionStatus, freeTrialStatus } = await checkUpdateSubscriptionStatus({
            supabaseClient,
            user,
        }));
    }

    console.log("→ [LOG] Triggered 02");

    const hasPremiumSubscription = subscriptionStatus === SubscriptionStatus.ACTIVE;
    const isOnFreeTrial = freeTrialStatus === FreeTrialStatus.ACTIVE;
    const hasPremiumOrFreeTrial = hasPremiumSubscription || isOnFreeTrial;

    const currentPath = request.nextUrl.pathname;

    if (hasPremiumOrFreeTrial) {
        return HIDE_ON_PREMIUM_PLAN.includes(currentPath)
            ? nextResponse.redirect(new URL("/", request.url))
            : nextResponse.next();
    }

    if (!hasPremiumOrFreeTrial) {
        return currentPath !== "/choose-pricing-plan"
            ? nextResponse.redirect(new URL("/choose-pricing-plan", request.url))
            : nextResponse.next();
    }
};

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
