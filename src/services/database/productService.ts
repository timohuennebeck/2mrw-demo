"use server";

import { isFreePlanEnabled } from "@/config/billingConfig";
import { ProductWithPrices } from "@/interfaces";
import { handleSupabaseError } from "@/utils/errors/supabaseError";
import { createClient } from "../integration/server";
import { BillingPlan } from "@/enums";

export const fetchProductsWithPrices = async () => {
    try {
        const supabase = await createClient();

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

        const productsWithPrices = products
            .map((product) => ({
                ...product,
                prices: prices.filter((price) => price.product_id === product.id),
            }))
            .filter((product) =>
                isFreePlanEnabled() ? true : product.billing_plan !== BillingPlan.NONE,
            );

        return { products: productsWithPrices as ProductWithPrices[], error: null };
    } catch (error) {
        return {
            products: null,
            error: handleSupabaseError({ error, fnTitle: "fetchProductsWithPrices" }),
        };
    }
};

export const getProductNameByTier = async (subscriptionTier: string) => {
    const supabase = await createClient();

    const { data: packageData, error: packageError } = await supabase
        .from("products")
        .select("name")
        .eq("subscription_tier", subscriptionTier)
        .single();

    if (packageError) throw packageError;

    return packageData.name;
};

export const fetchSubscriptionTier = async (stripePriceId: string) => {
    try {
        const supabase = await createClient();

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

export const fetchBillingPlan = async (stripePriceId: string) => {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("stripe_prices")
            .select("billing_plan")
            .eq("stripe_price_id", stripePriceId)
            .single();

        if (error) throw error;

        return { billingPlan: data?.billing_plan, error: null };
    } catch (error) {
        return {
            billingPlan: null,
            error: handleSupabaseError({ error, fnTitle: "fetchBillingPlan" }),
        };
    }
};
