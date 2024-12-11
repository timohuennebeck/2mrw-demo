"use server";

import { BillingPlan, SubscriptionStatus, SubscriptionTier } from "@/enums";
import {
    CreatePurchasedSubscriptionTableParams,
    PurchasedSubscription,
    UpdateUserSubscriptionStatusParams,
} from "@/interfaces";
import { handleSupabaseError } from "@/utils/errors/supabaseError";
import moment from "moment";
import { createSupabasePowerUserClient } from "../integration/admin";
import { createClient } from "../integration/server";
import { checkRowExists, getEndDate } from "./baseService";

export const fetchUserSubscription = async (userId: string) => {
    try {
        const supabase = await createClient();

        const defaultResponse = {
            subscription: null,
            error: null,
        };

        const { rowExists, error: rowCheckError } = await checkRowExists(
            "user_subscriptions",
            userId,
        );

        if (rowCheckError) throw rowCheckError;

        if (!rowExists) return defaultResponse;

        const { data: subscription, error } = await supabase
            .from("user_subscriptions")
            .select("*")
            .eq("user_id", userId)
            .single();

        if (error) throw error;

        return {
            subscription: subscription as PurchasedSubscription,
            error: null,
        };
    } catch (error) {
        return {
            subscription: null,
            error: handleSupabaseError({ error, fnTitle: "fetchUserSubscription" }),
        };
    }
};

export const startUserSubscription = async ({
    userId,
    stripePriceId,
    subscriptionTier,
    stripeSubscriptionId,
    billingPlan,
}: CreatePurchasedSubscriptionTableParams) => {
    try {
        const adminSupabase = await createSupabasePowerUserClient();

        const endDate = await getEndDate(stripeSubscriptionId ?? "");

        const { error } = await adminSupabase.from("user_subscriptions").insert({
            user_id: userId,
            stripe_price_id: stripePriceId,
            status: SubscriptionStatus.ACTIVE,
            subscription_tier: subscriptionTier,
            stripe_subscription_id: stripeSubscriptionId,
            billing_plan: billingPlan,
            end_date: endDate,
            updated_at: moment().toISOString(),
            created_at: moment().toISOString(),
        });

        if (error) throw error;

        await adminSupabase.auth.admin.updateUserById(userId, {
            user_metadata: {
                subscription_status: SubscriptionStatus.ACTIVE,
                subscription_updated_at: moment().toISOString(),
            },
        });

        return { success: true, error: null };
    } catch (error) {
        return {
            success: null,
            error: handleSupabaseError({ error, fnTitle: "startUserSubscription" }),
        };
    }
};

export const terminateUserSubscription = async (userId: string) => {
    /**
     * this function is used to terminate the users subscription
     * its run inside the cron jobs to end the subscription and downgrade the user to the free plan
     */

    try {
        const adminSupabase = await createSupabasePowerUserClient();

        const { error } = await adminSupabase
            .from("user_subscriptions")
            .update({
                updated_at: moment().toISOString(),
                status: SubscriptionStatus.EXPIRED,
            })
            .eq("user_id", userId);

        await adminSupabase.auth.admin.updateUserById(userId, {
            user_metadata: {
                subscription_status: SubscriptionStatus.EXPIRED,
            },
        });

        if (error) throw error;

        return { success: true, error: null };
    } catch (error) {
        return {
            success: null,
            error: handleSupabaseError({ error, fnTitle: "terminateUserSubscription" }),
        };
    }
};

export const updateUserSubscription = async ({
    userId,
    stripePriceId,
    subscriptionTier,
    stripeSubscriptionId,
    endDate,
    billingPlan,
}: UpdateUserSubscriptionStatusParams) => {
    try {
        const adminSupabase = await createSupabasePowerUserClient();

        const isOneTimePayment = billingPlan === BillingPlan.ONE_TIME;

        const { error } = await adminSupabase
            .from("user_subscriptions")
            .update({
                stripe_price_id: stripePriceId,
                status: SubscriptionStatus.ACTIVE,
                subscription_tier: subscriptionTier,
                stripe_subscription_id: isOneTimePayment ? null : stripeSubscriptionId,
                billing_plan: billingPlan,
                end_date: isOneTimePayment ? null : endDate,
                updated_at: moment().toISOString(),
            })
            .eq("user_id", userId);

        if (error) throw error;

        await adminSupabase.auth.admin.updateUserById(userId, {
            user_metadata: {
                subscription_status: SubscriptionStatus.ACTIVE,
                subscription_updated_at: moment().toISOString(),
            },
        });

        return { success: true, error: null };
    } catch (error) {
        return {
            success: null,
            error: handleSupabaseError({ error, fnTitle: "updateUserSubscription" }),
        };
    }
};

export const downgradeUserToFreePlan = async (userId: string) => {
    try {
        const adminSupabase = await createSupabasePowerUserClient();

        const { error } = await adminSupabase
            .from("user_subscriptions")
            .update({
                status: SubscriptionStatus.ACTIVE,
                subscription_tier: SubscriptionTier.FREE,
                billing_plan: BillingPlan.NONE,
                stripe_price_id: null,
                stripe_subscription_id: null,
                end_date: null,
                updated_at: moment().toISOString(),
            })
            .eq("user_id", userId);

        await adminSupabase.auth.admin.updateUserById(userId, {
            user_metadata: {
                subscription_status: SubscriptionStatus.ACTIVE,
                subscription_updated_at: moment().toISOString(),
            },
        });

        if (error) throw error;
        return { success: true, error: null };
    } catch (error) {
        return {
            success: null,
            error: handleSupabaseError({ error, fnTitle: "startFreePlan" }),
        };
    }
};

export const startFreePlan = async (userId: string) => {
    try {
        const adminSupabase = await createSupabasePowerUserClient();

        const { error } = await adminSupabase.from("user_subscriptions").insert({
            user_id: userId,
            status: SubscriptionStatus.ACTIVE,
            subscription_tier: SubscriptionTier.FREE,
            billing_plan: BillingPlan.NONE,
            stripe_price_id: null,
            stripe_subscription_id: null,
            end_date: null,
            updated_at: moment().toISOString(),
        });

        await adminSupabase.auth.admin.updateUserById(userId, {
            user_metadata: {
                subscription_status: SubscriptionStatus.ACTIVE,
                subscription_updated_at: moment().toISOString(),
            },
        });

        if (error) throw error;
        return { success: true, error: null };
    } catch (error) {
        return {
            success: null,
            error: handleSupabaseError({ error, fnTitle: "startFreePlan" }),
        };
    }
};

export const cancelUserSubscription = async (userId: string, endDate: string) => {
    try {
        const adminSupabase = await createSupabasePowerUserClient();

        const { error } = await adminSupabase
            .from("user_subscriptions")
            .update({
                updated_at: moment().toISOString(),
                status: SubscriptionStatus.CANCELLED,
                end_date: endDate,
            })
            .eq("user_id", userId);

        await adminSupabase.auth.admin.updateUserById(userId, {
            user_metadata: {
                subscription_status: SubscriptionStatus.CANCELLED,
                subscription_updated_at: moment().toISOString(),
            },
        });

        if (error) throw error;

        return { success: true, error: null };
    } catch (error) {
        return {
            success: null,
            error: handleSupabaseError({ error, fnTitle: "cancelUserSubscription" }),
        };
    }
};
