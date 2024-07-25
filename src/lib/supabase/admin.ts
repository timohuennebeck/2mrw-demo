import { SubscriptionStatus } from "@/enums/SubscriptionStatus";
import { FreeTrialStatus } from "@/enums/FreeTrialStatus";
import {
    CreatePurchasedSubscriptionTableParams,
    CreateUserTableParams,
    EndUserFreeTrialParams,
    StartUserFreeTrialParams,
    UpdateUserSubscriptionStatusParams,
} from "./supabaseInterfaces";

export const handleSupabaseError = (error: unknown) => {
    console.error("Supabase error:", error);

    return { error };
};

export const createUserTable = async ({ supabase, user }: CreateUserTableParams) => {
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
    supabase,
    userId,
}: CreatePurchasedSubscriptionTableParams) => {
    try {
        const { error } = await supabase.from("purchased_subscriptions").insert({
            user_id: userId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            status: SubscriptionStatus.NOT_PURCHASED,
        });

        if (error) throw error;

        return { success: true, error: null };
    } catch (error) {
        return { success: null, error: handleSupabaseError(error) };
    }
};

export const updateUserSubscriptionStatus = async ({
    supabase,
    userId,
    stripePriceId,
    status,
}: UpdateUserSubscriptionStatusParams) => {
    try {
        const { data: subscription, error } = await supabase
            .from("purchased_subscriptions")
            .update({
                updated_at: new Date().toISOString(),
                stripe_price_id: stripePriceId,
                status,
            })
            .eq("user_id", userId)
            .select()
            .single();

        if (error) throw error;

        return { success: true, error: null };
    } catch (error) {
        return { success: null, error: handleSupabaseError(error) };
    }
};

export const startUserFreeTrial = async ({
    supabase,
    userId,
    stripePriceId,
    freeTrialEndDate,
}: StartUserFreeTrialParams) => {
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

export const endUserFreeTrial = async ({ supabase, userId }: EndUserFreeTrialParams) => {
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
