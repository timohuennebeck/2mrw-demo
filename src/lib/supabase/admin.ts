import { SubscriptionStatus } from "@/enums/SubscriptionStatus";
import { SupabaseClient, User } from "@supabase/supabase-js";
import { FreeTrialStatus } from "@/enums/FreeTrialStatus";

export const createUserTable = async ({
    supabase,
    user,
}: {
    supabase: SupabaseClient;
    user: User;
}) => {
    const { error } = await supabase.from("users").insert({
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        full_name: user.user_metadata.full_name,
        email: user.email,
    });

    if (error) throw error;
};

export const createSubscriptionTable = async ({
    supabase,
    userId,
}: {
    supabase: SupabaseClient;
    userId: string;
}) => {
    const { error } = await supabase.from("purchased_subscriptions").insert({
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: SubscriptionStatus.NOT_PURCHASED,
    });

    if (error) throw error;
};

export const updateUserSubscriptionStatus = async ({
    supabase,
    userId,
    stripePriceId,
    status,
}: {
    supabase: SupabaseClient;
    userId: string;
    stripePriceId: string;
    status: SubscriptionStatus;
}) => {
    try {
        const { data, error } = await supabase
            .from("purchased_subscriptions")
            .update({
                updated_at: new Date().toISOString(),
                stripe_price_id: stripePriceId,
                status,
            })
            .eq("user_id", userId)
            .select()
            .single();

        if (error) {
            console.error("There has been an error", error);

            return { error: error };
        }

        return { subscription: data, error: null };
    } catch (err) {
        console.error(`Error creating Subscription Table for User: ${userId}`, err);

        return { error: err };
    }
};

export const startUserFreeTrial = async ({
    supabase,
    userId,
    stripePriceId,
    freeTrialEndDate,
}: {
    supabase: SupabaseClient;
    userId: string;
    stripePriceId: string;
    freeTrialEndDate: Date;
}) => {
    const { data, error } = await supabase.from("free_trials").insert({
        user_id: userId,
        start_date: new Date().toISOString(),
        end_date: freeTrialEndDate.toISOString(),
        stripe_price_id: stripePriceId,
        status: FreeTrialStatus.ACTIVE,
    });

    if (error) {
        return { error: error };
    }

    return { freeTrial: data, error: null };
};

export const endUserFreeTrial = async ({
    supabase,
    userId,
}: {
    supabase: SupabaseClient;
    userId: string;
}) => {
    try {
        const { error } = await supabase
            .from("free_trials")
            .update({
                end_date: new Date().toISOString(),
                status: FreeTrialStatus.EXPIRED,
            })
            .eq("user_id", userId)
            .single();

        if (error) {
            if (error.code === "PGRST116") {
                // means that no match was found
                return { success: null, error: null };
            }

            // triggered when some other error occurs
            throw error;
        }

        return { success: true, error: null };
    } catch (error) {
        console.error("Unexpected error ending free trial:", error);

        return { success: null, error: error as Error };
    }
};
