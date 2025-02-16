"use server";

import { SubscriptionStatus, SubscriptionTier } from "@/enums";
import {
    PurchasedSubscription,
    UpdateUserSubscriptionParams,
} from "@/interfaces";
import { handleError } from "@/utils/errors/error";
import moment from "moment";
import { createSupabasePowerUserClient } from "../supabase-clients/admin";
import { createClient } from "../supabase-clients/server";

const FREE_PLAN_IDENTIFIER = "price_free";

export const fetchUserSubscription = async (userId: string) => {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("subscriptions")
            .select("*")
            .eq("user_id", userId)
            .single();

        if (error) return { data: null, error };

        return { data: data as PurchasedSubscription, error: null };
    } catch (error) {
        const supabaseError = handleError(
            error,
            "fetchUserSubscription",
        );
        return { data: null, error: supabaseError };
    }
};

export const updateUserSubscription = async ({
    userId,
    stripePriceId,
    stripeSubscriptionId,
    status,
    subscriptionTier,
    billingPeriod,
    billingPlan,
    endDate,
}: UpdateUserSubscriptionParams) => {
    /**
     * this fn runs inside the stripe webhook to update the user subscription
     * Thus, we need to use the admin supabase client
     */

    try {
        const adminSupabase = await createSupabasePowerUserClient();

        // uses upsert in case the subscriptions table doesn't yet exist such as when isOneTimePaymentEnabled is enabled
        const { data, error } = await adminSupabase
            .from("subscriptions")
            .upsert({
                user_id: userId,
                stripe_price_id: stripePriceId,
                stripe_subscription_id: stripeSubscriptionId,
                status: status ?? SubscriptionStatus.ACTIVE,
                subscription_tier: subscriptionTier,
                billing_plan: billingPlan,
                billing_period: billingPeriod,
                end_date: endDate,
                updated_at: moment().toISOString(),
                created_at: moment().toISOString(),
            }, { onConflict: "user_id" });

        if (error) return { success: false, error };

        return { success: true, error: null };
    } catch (error) {
        const uncaughtError = handleError(error, "updateUserSubscription");
        return { success: false, error: uncaughtError };
    }
};

export const cancelUserSubscription = async (
    userId: string,
    endDate: string,
) => {
    /**
     * this fn runs inside the stripe webhook to cancel the user subscription
     * Thus, we need to use the admin supabase client
     */

    try {
        const adminSupabase = await createSupabasePowerUserClient();

        const { error } = await adminSupabase
            .from("subscriptions")
            .update({
                status: SubscriptionStatus.CANCELLED,
                end_date: endDate,
                updated_at: moment().toISOString(),
            })
            .eq("user_id", userId);

        if (error) return { success: false, error };

        return { success: true, error: null };
    } catch (error) {
        const uncaughtError = handleError(error, "cancelUserSubscription");
        return { success: false, error: uncaughtError };
    }
};

export const startFreePlan = async (userId: string) => {
    try {
        const adminSupabase = await createSupabasePowerUserClient();

        const { error } = await adminSupabase.from("subscriptions").insert(
            {
                user_id: userId,
                status: SubscriptionStatus.ACTIVE,
                subscription_tier: SubscriptionTier.FREE,
                stripe_price_id: FREE_PLAN_IDENTIFIER,
                billing_plan: null,
                billing_period: null,
                stripe_subscription_id: null,
                end_date: null,
                updated_at: moment().toISOString(),
                created_at: moment().toISOString(),
            },
        );

        if (error) {
            return { success: false, error };
        }

        return { success: true, error: null };
    } catch (error) {
        return {
            success: null,
            error: handleError(error, "startFreePlan"),
        };
    }
};
