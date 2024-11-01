"use server";

import { FreeTrial } from "@/interfaces/FreeTrial";
import { Product } from "@/interfaces/ProductInterfaces";
import { PurchasedSubscription } from "@/interfaces/SubscriptionInterfaces";
import { User } from "@/interfaces/UserInterfaces";
import { createClient } from "./server";
import { handleSupabaseError } from "../../lib/helper/handleSupabaseError";

export const checkUserRowExists = async ({
    tableId,
    userId,
}: {
    tableId: string;
    userId: string;
}) => {
    const supabase = createClient();

    try {
        const { error } = await supabase.from(tableId).select("*").eq("user_id", userId).single();

        if (error) {
            if (error.code === "PGRST116") {
                return { rowExists: false, error: null }; // no row found for this user
            }

            return { rowExists: false, error };
        }

        return { rowExists: true, error: null };
    } catch (error) {
        return { rowExists: false, error }; // unexpected errors (e.g., network issues, etc.)
    }
};

export const fetchUser = async ({ userEmail }: { userEmail: string }) => {
    const supabase = createClient();

    try {
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("email", userEmail)
            .single();

        if (error) throw error;

        const user: User = data;

        return { user, error: null };
    } catch (error) {
        return { user: null, error: handleSupabaseError({ error, fnTitle: "fetchUser" }) };
    }
};

export const fetchProducts = async () => {
    const supabase = createClient();

    try {
        const { data: products, error } = await supabase
            .from("products")
            .select("*")
            .eq("is_active", "TRUE")
            .order("id", { ascending: true });

        if (error) throw error;

        return { products: products as Product[], error: null };
    } catch (error) {
        return {
            products: null,
            error: handleSupabaseError({ error, fnTitle: "fetchProducts" }),
        };
    }
};

export const checkUserEmailExists = async ({ userEmail }: { userEmail: string }) => {
    const supabase = createClient();

    try {
        const { error } = await supabase.from("users").select("*").eq("email", userEmail).single();

        if (error) throw error;

        return { emailExists: true, error: null };
    } catch (error) {
        return {
            emailExists: false,
            error: handleSupabaseError({ error, fnTitle: "checkUserEmailExists" }),
        };
    }
};

export const fetchUserSubscription = async (userId: string) => {
    const supabase = createClient();

    try {
        const defaultResponse = {
            subscription: null,
            error: null,
        };

        const { rowExists, error: rowCheckError } = await checkUserRowExists({
            tableId: "purchased_subscriptions",
            userId,
        });

        if (rowCheckError) throw rowCheckError;

        if (!rowExists) return defaultResponse;

        const { data: subscription, error } = await supabase
            .from("purchased_subscriptions")
            .select("*")
            .eq("user_id", userId)
            .single();

        if (error) throw error;

        return {
            subscription: subscription as PurchasedSubscription,
            error: null,
        };
    } catch (error) {
        return {
            subscription: null,
            error: handleSupabaseError({ error, fnTitle: "fetchUserSubscription" }),
        };
    }
};

export const fetchUserFreeTrial = async (userId: string) => {
    const supabase = createClient();

    try {
        const { rowExists, error: rowCheckError } = await checkUserRowExists({
            tableId: "free_trials",
            userId,
        });

        if (rowCheckError) throw rowCheckError;

        if (!rowExists) {
            return {
                freeTrial: null,
                error: null,
            };
        }

        const { data: freeTrial, error } = await supabase
            .from("free_trials")
            .select("*")
            .eq("user_id", userId)
            .single();

        if (error) throw error;

        return {
            freeTrial: freeTrial as FreeTrial,
            error: null,
        };
    } catch (error) {
        return {
            freeTrial: null,
            error: handleSupabaseError({ error, fnTitle: "fetchUserFreeTrial" }),
        };
    }
};

export const fetchSubscriptionTier = async (stripePriceId: string) => {
    const supabase = createClient();

    try {
        const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("stripe_price_id", stripePriceId)
            .single();

        if (error) throw error;

        const product: Product = data;

        return { subscriptionTier: product.subscription_tier, error: null };
    } catch (error) {
        return {
            subscriptionTier: null,
            error: handleSupabaseError({ error, fnTitle: "fetchSubscriptionTier" }),
        };
    }
};
