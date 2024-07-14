import { StripePriceId } from "@/config/subscriptionPlans";
import { extractSubscriptionPlanDetails } from "../../helper/extractSubscriptionPlanDetails";
import { createClient } from "./client";
import { User } from "@supabase/supabase-js";

const supabase = createClient();

export const createUserTable = async ({ user }: { user: User }) => {
    const { error } = await supabase.from("users").insert({
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        full_name: user.user_metadata.full_name,
        email: user.email,
    });

    if (error) throw error;
};

export const createSubscriptionTable = async ({ userId }: { userId: string }) => {
    const { error } = await supabase.from("subscriptions").insert({
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    });

    if (error) throw error;
};

export const startUserFreeTrial = async ({
    userId,
    freeTrialEndDate,
}: {
    userId: string;
    freeTrialEndDate: Date;
}) => {
    const { error } = await supabase.from("free_trials").insert({
        user_id: userId,
        start_date: new Date().toISOString(),
        end_date: freeTrialEndDate.toISOString(),
        is_active: true,
    });

    if (error) {
        return { error: error };
    }

    return { sucess: true };
};

export const updateUserSubscriptionStatus = async ({
    userId,
    stripePriceId,
    hasPremium,
}: {
    userId: string;
    stripePriceId: string;
    hasPremium: boolean;
}) => {
    const plan = extractSubscriptionPlanDetails(stripePriceId as StripePriceId);

    if (!plan) {
        throw new Error(`Error, no plan found for price id: ${stripePriceId}`);
    }

    try {
        const { data, error } = await supabase
            .from("subscription")
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
            return;
        }

        return data;
    } catch (err) {
        console.error(`Error creating Subscription Table for User: ${userId}`, err);

        return err;
    }
};
