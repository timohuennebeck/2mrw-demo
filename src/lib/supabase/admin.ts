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

export const handleSupabaseError = (error: unknown) => {
    console.error("Supabase error:", error);

    return { error };
};

export const createUserTable = async ({ user }: { user: User }) => {
    const supabase = createClient();

    try {
        const { error } = await supabase.from("users").insert({
            user_id: user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            full_name: user.user_metadata.full_name,
            email: user.email,
        });

        if (error) throw error;

        return { success: true, error: null };
    } catch (error) {
        return { success: null, error: handleSupabaseError(error) };
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
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            stripe_price_id: stripePriceId,
            status: SubscriptionStatus.ACTIVE,
            subscription_tier: subscriptionTier,
        });

        if (error) throw error;

        return { success: true, error: null };
    } catch (error) {
        return { success: null, error: handleSupabaseError(error) };
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
                updated_at: new Date().toISOString(),
                stripe_price_id: stripePriceId,
                status,
                subscription_tier: subscriptionTier,
            })
            .eq("user_id", userId)
            .select("*")
            .single();

        if (error) throw error;

        return { success: true, error: null };
    } catch (error) {
        return { success: null, error: handleSupabaseError(error) };
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
            start_date: new Date().toISOString(),
            end_date: freeTrialEndDate.toISOString(),
            stripe_price_id: stripePriceId,
            status: FreeTrialStatus.ACTIVE,
        });

        if (error) throw error;

        return { success: true, error: null };
    } catch (error) {
        return { success: null, error: handleSupabaseError(error) };
    }
};

export const endUserFreeTrial = async ({ userId }: { userId: string }) => {
    const supabase = createClient();

    try {
        const { error } = await supabase
            .from("free_trials")
            .update({
                end_date: new Date().toISOString(),
                status: FreeTrialStatus.EXPIRED,
            })
            .eq("user_id", userId)
            .single();

        if (error) throw error;

        return { success: true, error: null };
    } catch (error) {
        return { success: null, error: handleSupabaseError(error) };
    }
};
