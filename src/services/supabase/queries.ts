"use server";

import { FreeTrial } from "@/interfaces/FreeTrial";
import { Product, ProductWithPrices } from "@/interfaces/ProductInterfaces";
import { PurchasedSubscription } from "@/interfaces/SubscriptionInterfaces";
import { createClient } from "./server";
import { handleSupabaseError } from "../../lib/helper/handleSupabaseError";
import { User } from "@/interfaces/UserInterfaces";

export const checkUserRowExists = async ({
    tableId,
    userId,
}: {
    tableId: string;
    userId: string;
}) => {
    const supabase = createClient();

    try {
        const { error } = await supabase
            .from(tableId)
            .select("user_id")
            .eq("user_id", userId)
            .single();

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

export const fetchProductsWithPrices = async () => {
    const supabase = createClient();

    try {
        const { data: products, error: productsError } = await supabase
            .from("products")
            .select("*")
            .eq("is_active", "TRUE")
            .order("id", { ascending: true });

        if (productsError) throw productsError;

        const { data: prices, error: pricesError } = await supabase
            .from("stripe_prices")
            .select("*")
            .eq("is_active", "TRUE")
            .order("id", { ascending: true });

        if (pricesError) throw pricesError;

        const productsWithPrices = products.map((product) => ({
            ...product,
            prices: prices.filter((price) => price.product_id === product.id),
        }));

        return { products: productsWithPrices as ProductWithPrices[], error: null };
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
        const { error } = await supabase
            .from("users")
            .select("email")
            .eq("email", userEmail)
            .single();

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

export const fetchUser = async (userId: string) => {
    const supabase = createClient();

    try {
        const { data: user, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", userId)
            .single();

        if (error) throw error;

        return {
            user: user as User,
            error: null,
        };
    } catch (error) {
        return {
            user: null,
            error: handleSupabaseError({ error, fnTitle: "fetchUser" }),
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
        const { data: stripePriceData, error: stripePriceError } = await supabase
            .from("stripe_prices")
            .select("product_id")
            .eq("stripe_price_id", stripePriceId)
            .single();

        if (stripePriceError) throw stripePriceError;

        const { data: productData, error: productError } = await supabase
            .from("products")
            .select("subscription_tier")
            .eq("id", stripePriceData?.product_id)
            .single();

        if (productError) throw productError;

        return { subscriptionTier: productData?.subscription_tier, error: null };
    } catch (error) {
        return {
            subscriptionTier: null,
            error: handleSupabaseError({ error, fnTitle: "fetchSubscriptionTier" }),
        };
    }
};

export const fetchPricingModel = async (stripePriceId: string) => {
    const supabase = createClient();

    try {
        const { data, error } = await supabase
            .from("stripe_prices")
            .select("pricing_model")
            .eq("stripe_price_id", stripePriceId)
            .single();

        if (error) throw error;

        return { pricingModel: data?.pricing_model, error: null };
    } catch (error) {
        return {
            pricingModel: null,
            error: handleSupabaseError({ error, fnTitle: "fetchPricingModel" }),
        };
    }
};

export const getUserId = async () => {
    //  TODO: check if this returns the correct user
    const supabase = createClient();

    try {
        const { data, error } = await supabase.from("users").select("id").single();

        if (error) throw error;

        return data?.id;
    } catch (error) {
        return null;
    }
};
