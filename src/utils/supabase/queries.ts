import { Subscription } from "@/interfaces/Subscription";
import { createClient } from "./client";
import { FreeTrial } from "@/interfaces/FreeTrial";
import { FreeTrialStatus } from "@/app/enums/FreeTrialStatus";
import { SubscriptionStatus } from "@/app/enums/SubscriptionStatus";
import { Product } from "@/interfaces/Product";

const supabase = createClient();

export const fetchProducts = async () => {
    const { data: products, error } = await supabase.from("products").select("*");

    if (error) {
        console.error("Error fetching products:", error);
        return { products: null, error };
    }

    return { products: products as Product[], error: null };
};

export const checkUserExists = async ({ userEmail }: { userEmail: string }) => {
    const { data: existingUser } = await supabase
        .from("users")
        .select("*")
        .eq("email", userEmail)
        .single();

    return existingUser;
};

export const checkSubscriptionStatus = async ({ userId }: { userId: string }) => {
    try {
        const { data, error } = await supabase
            .from("user_subscriptions")
            .select("*")
            .eq("user_id", userId)
            .single();

        if (error) {
            if (error.code === "PGRST116") {
                // no subscription found for the user
                return {
                    status: SubscriptionStatus.NOT_PURCHASED,
                    subscription: null,
                    error: null,
                };
            }
            throw error;
        }

        const response: Subscription = data;

        if (response.has_premium) {
            return {
                status: SubscriptionStatus.ACTIVE,
                subscription: response,
                error: null,
            };
        } else {
            return {
                status: SubscriptionStatus.NOT_PURCHASED,
                subscription: null,
                error: null,
            };
        }
    } catch (error) {
        console.error("Unexpected error checking subscription status:", error);
        return { status: SubscriptionStatus.ERROR, subscription: null, error: error as Error };
    }
};

export const checkFreeTrialStatus = async ({ userId }: { userId: string }) => {
    try {
        const { data, error } = await supabase
            .from("free_trials")
            .select("*")
            .eq("user_id", userId)
            .single();

        if (error) {
            if (error.code === "PGRST116") {
                // no free trial found for the user
                return { status: FreeTrialStatus.NOT_STARTED, freeTrial: null, error: null };
            }
            throw error;
        }

        const freeTrial = data as FreeTrial;
        const now = new Date();
        const startDate = new Date(freeTrial.start_date);
        const endDate = new Date(freeTrial.end_date);

        if (now >= startDate && now <= endDate) {
            return { status: FreeTrialStatus.ACTIVE, freeTrial, error: null };
        } else {
            return { status: FreeTrialStatus.EXPIRED, freeTrial, error: null };
        }
    } catch (error) {
        console.error("Unexpected error checking free trial status:", error);
        return { status: FreeTrialStatus.ERROR, error: error as Error };
    }
};
