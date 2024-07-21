import { StripePriceId } from "@/config/subscriptionPlans";
import { extractSubscriptionPlanDetails } from "../../helper/extractSubscriptionPlanDetails";
import { SupabaseClient, User } from "@supabase/supabase-js";

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
    const { error } = await supabase.from("subscriptions").insert({
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    });

    if (error) throw error;
};

export const startUserFreeTrial = async ({
    supabase,
    userId,
    freeTrialEndDate,
}: {
    supabase: SupabaseClient,
    userId: string;
    freeTrialEndDate: Date;
}) => {
    const { data, error } = await supabase.from("free_trials").insert({
        user_id: userId,
        start_date: new Date().toISOString(),
        end_date: freeTrialEndDate.toISOString(),
        is_active: true,
    });

    if (error) {
        return { error: error };
    }

    return { freeTrial: data, error: null };
};

export const endUserFreeTrial = async ({ supabase, userId }: { supabase: SupabaseClient, userId: string }) => {
    try {
        const { error } = await supabase
            .from("free_trials")
            .update({
                end_date: new Date().toISOString(),
                is_active: false,
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

export const updateUserSubscriptionStatus = async ({
    supabase,
    userId,
    stripePriceId,
    hasPremium,
}: {
    supabase: SupabaseClient
    userId: string;
    stripePriceId: string;
    hasPremium: boolean;
}) => {
    const plan = extractSubscriptionPlanDetails(stripePriceId as StripePriceId);

    if (!plan) {
        return { error: `Error, no plan found for price id: ${stripePriceId}` };
    }

    try {
        const { data, error } = await supabase
            .from("subscriptions")
            .update({
                updated_at: new Date().toISOString(),
                has_premium: hasPremium,
                subscription_plan: plan.name,
                stripe_price_id: stripePriceId,
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
