import { StripePriceId } from "@/config/subscriptionPlans";
import supabase from "@/lib/supabaseClient";
import { extractSubscriptionPlanDetails } from "../extractSubscriptionPlanDetails";

export const createUserInSupabase = async ({
    userEmail,
    stripePriceId,
}: {
    userEmail: string;
    stripePriceId: StripePriceId;
}) => {
    const plan = extractSubscriptionPlanDetails(stripePriceId as StripePriceId);

    if (!plan) {
        throw new Error(`Error, no plan found for price id: ${stripePriceId}`);
    }

    return await supabase
        .from("users")
        .insert({
            email: userEmail,
            has_premium: plan.hasPremium,
            subscription_plan: plan.name,
            stripe_price_id: stripePriceId,
        })
        .select()
        .single();
};

export const updateExistingUserInSupabase = async ({
    userId,
    stripePriceId,
}: {
    userId: number;
    stripePriceId: StripePriceId;
}) => {
    const plan = extractSubscriptionPlanDetails(stripePriceId as StripePriceId);

    if (!plan) {
        throw new Error(`Error, no plan found for price id: ${stripePriceId}`);
    }

    return await supabase
        .from("users")
        .update({
            has_premium: plan.hasPremium,
            subscription_plan: plan.name,
            stripe_price_id: stripePriceId,
        })
        .eq("id", userId)
        .select()
        .single();
};
