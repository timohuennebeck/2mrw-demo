import { StripePriceId } from "@/config/subscriptionPlans";
import { extractSubscriptionPlanDetails } from "../../helper/extractSubscriptionPlanDetails";
import { createClient } from "./client";

export const createUserInSupabase = async ({
    userId,
    userFullName,
    userEmail,
}: {
    userId: string;
    userFullName: string;
    userEmail: string;
}) => {
    const supabase = createClient();

    return await supabase
        .from("users")
        .insert({
            id: userId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            full_name: userFullName,
            email: userEmail,
        })
        .select()
        .single();
};

export const updateUserSubscriptionStatus = async ({
    userId,
    stripePriceId,
}: {
    userId: string;
    stripePriceId: string;
}) => {
    const plan = extractSubscriptionPlanDetails(stripePriceId as StripePriceId);

    if (!plan) {
        throw new Error(`Error, no plan found for price id: ${stripePriceId}`);
    }

    return supabase
        .from("subscription")
        .update({
            updated_at: new Date().toISOString(),
            has_premium: true,
            subscription_plan: plan.name,
            stripe_price_id: stripePriceId,
        })
        .eq("user_id", userId)
        .select()
        .single();
};
