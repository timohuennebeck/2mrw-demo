"use server";

import { SubscriptionStatus } from "@/enums/SubscriptionStatus";
import { FreeTrialStatus } from "@/enums/FreeTrialStatus";
import {
    CreatePurchasedSubscriptionTableParams,
    StartUserFreeTrialParams,
    UpdateUserSubscriptionStatusParams,
} from "./supabaseInterfaces";
import { createClient } from "./server";
import { User } from "@supabase/supabase-js";
import { handleSupabaseError } from "../../lib/helper/handleSupabaseError";
import moment from "moment";
import { PaymentEnums } from "@/enums/PaymentEnums";
import { isOneTimePaymentEnabled } from "@/config/paymentConfig";
import { fetchProducts } from "./queries";

const getEndDate = async (stripePriceId: string) => {
    if (isOneTimePaymentEnabled()) {
        return null; // one-time payments don't have an end date
    }

    // fetch products to check price IDs
    const { products } = await fetchProducts();
    if (!products) throw new Error("Failed to fetch products");

    // check if the stripePriceId matches any yearly subscription
    const isYearlySubscription = products.some(
        (product) => product.pricing.subscription?.yearly?.stripe_price_id === stripePriceId,
    );

    const currentDate = moment();

    return isYearlySubscription
        ? currentDate.add(1, "year").toISOString()
        : currentDate.add(1, "month").toISOString();
};

export const createUserTable = async ({ user }: { user: User }) => {
    const supabase = createClient();

    try {
        const { error } = await supabase.from("users").insert({
            user_id: user.id,
            created_at: moment().toISOString(),
            updated_at: moment().toISOString(),
            first_name: user.user_metadata.full_name,
            email: user.email,
        });

        if (error) throw error;

        return { success: true, error: null };
    } catch (error) {
        return { success: null, error: handleSupabaseError({ error, fnTitle: "createUserTable" }) };
    }
};

export const createPurchasedSubscriptionTable = async ({
    userId,
    stripePriceId,
    subscriptionTier,
}: CreatePurchasedSubscriptionTableParams) => {
    const supabase = createClient();

    try {
        const endDate = await getEndDate(stripePriceId);

        const { error } = await supabase.from("purchased_subscriptions").insert({
            user_id: userId,
            stripe_price_id: stripePriceId,
            status: SubscriptionStatus.ACTIVE,
            subscription_tier: subscriptionTier,
            payment_type: isOneTimePaymentEnabled()
                ? PaymentEnums.ONE_TIME
                : PaymentEnums.SUBSCRIPTION,
            end_date: endDate,
            updated_at: moment().toISOString(),
            created_at: moment().toISOString(),
        });

        if (error) throw error;

        return { success: true, error: null };
    } catch (error) {
        return {
            success: null,
            error: handleSupabaseError({ error, fnTitle: "createPurchasedSubscriptionTable" }),
        };
    }
};

export const updateUserPurchasedSubscription = async ({
    userId,
    stripePriceId,
    status,
    subscriptionTier,
}: UpdateUserSubscriptionStatusParams) => {
    const supabase = createClient();

    try {
        const endDate = await getEndDate(stripePriceId);

        const { error } = await supabase
            .from("purchased_subscriptions")
            .update({
                stripe_price_id: stripePriceId,
                status,
                subscription_tier: subscriptionTier,
                payment_type: isOneTimePaymentEnabled()
                    ? PaymentEnums.ONE_TIME
                    : PaymentEnums.SUBSCRIPTION,
                end_date: endDate,
                updated_at: moment().toISOString(),
            })
            .eq("user_id", userId);

        if (error) throw error;

        return { success: true, error: null };
    } catch (error) {
        return {
            success: null,
            error: handleSupabaseError({ error, fnTitle: "updateUserPurchasedSubscription" }),
        };
    }
};

export const createFreeTrialTable = async ({
    userId,
    stripePriceId,
    freeTrialEndDate,
}: StartUserFreeTrialParams) => {
    const supabase = createClient();

    try {
        const { error } = await supabase.from("free_trials").insert({
            user_id: userId,
            start_date: moment().toISOString(),
            end_date: moment(freeTrialEndDate).toISOString(),
            stripe_price_id: stripePriceId,
            status: FreeTrialStatus.ACTIVE,
        });

        if (error) throw error;

        return { success: true, error: null };
    } catch (error) {
        return {
            success: null,
            error: handleSupabaseError({ error, fnTitle: "createFreeTrialTable" }),
        };
    }
};

export const endUserFreeTrial = async ({ userId }: { userId: string }) => {
    const supabase = createClient();

    try {
        const { error } = await supabase
            .from("free_trials")
            .update({
                updated_at: moment().toISOString(),
                status: FreeTrialStatus.EXPIRED,
            })
            .eq("user_id", userId);

        await supabase.auth.updateUser({
            data: {
                free_trial_status: FreeTrialStatus.EXPIRED,
            },
        });

        if (error) throw error;

        return { success: true, error: null };
    } catch (error) {
        return {
            success: null,
            error: handleSupabaseError({ error, fnTitle: "endUserFreeTrial" }),
        };
    }
};

export const endUserSubscription = async (userId: string) => {
    const supabase = createClient();

    try {
        const { error } = await supabase
            .from("purchased_subscriptions")
            .update({
                updated_at: moment().toISOString(),
                status: SubscriptionStatus.EXPIRED,
            })
            .eq("user_id", userId);

        await supabase.auth.updateUser({
            data: {
                subscription_status: SubscriptionStatus.EXPIRED,
            },
        });

        if (error) throw error;

        return { success: true, error: null };
    } catch (error) {
        return {
            success: null,
            error: handleSupabaseError({ error, fnTitle: "endUserSubscription" }),
        };
    }
};

export const cancelUserFreeTrial = async ({ userId }: { userId: string }) => {
    const supabase = createClient();

    try {
        const { error } = await supabase
            .from("free_trials")
            .update({
                updated_at: moment().toISOString(),
                status: FreeTrialStatus.CANCELLED,
            })
            .eq("user_id", userId);

        await supabase.auth.updateUser({
            data: {
                free_trial_status: FreeTrialStatus.CANCELLED,
            },
        });

        if (error) throw error;

        return { success: true, error: null };
    } catch (error) {
        return {
            success: null,
            error: handleSupabaseError({ error, fnTitle: "cancelUserFreeTrial" }),
        };
    }
};

export const cancelUserSubscription = async (userId: string) => {
    const supabase = createClient();

    try {
        const { error } = await supabase
            .from("purchased_subscriptions")
            .update({
                updated_at: moment().toISOString(),
                status: SubscriptionStatus.CANCELLED,
            })
            .eq("user_id", userId);

        await supabase.auth.updateUser({
            data: {
                subscription_status: SubscriptionStatus.CANCELLED,
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
