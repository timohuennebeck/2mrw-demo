import { StripePriceId } from "@/config/subscriptionPlans";
import { extractSubscriptionPlanDetails } from "../../helper/extractSubscriptionPlanDetails";
import { createClient } from "./client";

const supabase = createClient();

export const createUserTable = async ({
    userId,
    userFullName,
    userEmail,
}: {
    userId: string;
    userFullName: string;
    userEmail: string;
}) => {
    try {
        const { data, error } = await supabase
            .from("users")
            .insert({
                user_id: userId,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                full_name: userFullName,
                email: userEmail,
            })
            .select()
            .single();

        if (error) {
            console.error("There has been an error", error);
            return;
        }

        return data;
    } catch (err) {
        console.error(`Error creating User Table for User: ${userId}`, err);

        return err;
    }
};

export const createSubscriptionTable = async ({ userId }: { userId: string }) => {
    try {
        const { data, error } = await supabase
            .from("subscriptions")
            .insert({
                user_id: userId,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
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

    try {
        const { data, error } = await supabase
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
