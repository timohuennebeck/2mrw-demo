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
        const { error } = await supabase.from("purchased_subscriptions").insert({
            user_id: userId,
            created_at: moment().toISOString(),
            updated_at: moment().toISOString(),
            stripe_price_id: stripePriceId,
            status: SubscriptionStatus.ACTIVE,
            subscription_tier: subscriptionTier,
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
        const { error } = await supabase
            .from("purchased_subscriptions")
            .update({
                updated_at: moment().toISOString(),
                stripe_price_id: stripePriceId,
                status,
                subscription_tier: subscriptionTier,
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

export const endUserSubscription = async ({ userId }: { userId: string }) => {
    const supabase = createClient();

    try {
        const { error } = await supabase
            .from("purchased_subscriptions")
            .update({
                updated_at: moment().toISOString(),
                status: SubscriptionStatus.EXPIRED,
            })
            .eq("user_id", userId);

        if (error) throw error;

        return { success: true, error: null };
    } catch (error) {
        return {
            success: null,
            error: handleSupabaseError({ error, fnTitle: "endUserSubscription" }),
        };
    }
};
