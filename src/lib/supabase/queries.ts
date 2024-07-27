"use server";

import { FreeTrialStatus } from "@/enums/FreeTrialStatus";
import { SubscriptionStatus } from "@/enums/SubscriptionStatus";
import { SubscriptionTier } from "@/enums/SubscriptionTier";
import { FreeTrial } from "@/interfaces/FreeTrial";
import { Product } from "@/interfaces/ProductInterfaces";
import { PurchasedSubscription } from "@/interfaces/SubscriptionInterfaces";
import { User } from "@/interfaces/UserInterfaces";
import { createClient } from "./server";

export const handleSupabaseError = (error: unknown) => {
    console.error("Supabase error:", error);

    return { error };
};

export const checkTableExists = async ({ tableId }: { tableId: string }) => {
    const supabase = createClient();

    try {
        const { error } = await supabase.from(tableId).select("*").single();

        if (error) throw error;

        return { tableExists: true, error: null };
    } catch (error) {
        return { tableExists: false, error: handleSupabaseError(error) };
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
        return { user: null, error: handleSupabaseError(error) };
    }
};

export const fetchSupabaseUser = async () => {
    const supabase = createClient();

    try {
        const {
            data: { user },
            error,
        } = await supabase.auth.getUser();

        if (!user) throw error;

        return { user, error: null };
    } catch (error) {
        return { user: null, error: handleSupabaseError(error) };
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
        return { products: null, error: handleSupabaseError(error) };
    }
};

export const checkUserEmailExists = async ({ userEmail }: { userEmail: string }) => {
    const supabase = createClient();

    try {
        const { error } = await supabase.from("users").select("*").eq("email", userEmail).single();

        if (error) throw error;

        return { emailExists: true, error: null };
    } catch (error) {
        return { emailExists: false, error: handleSupabaseError(error) };
    }
};

export const checkPurchasedSubscriptionStatus = async ({ userId }: { userId: string }) => {
    const supabase = createClient();

    try {
        const { data, error } = await supabase
            .from("purchased_subscriptions")
            .select("*")
            .eq("user_id", userId)
            .single();

        if (error) throw error;

        const subscription: PurchasedSubscription = data;

        switch (subscription.status) {
            case SubscriptionStatus.ACTIVE:
                return {
                    status: SubscriptionStatus.ACTIVE,
                    subscriptionTier: subscription.subscription_tier,
                    subscription: subscription,
                    error: null,
                };

            case SubscriptionStatus.NOT_PURCHASED:
                return {
                    status: SubscriptionStatus.NOT_PURCHASED,
                    subscriptionTier: SubscriptionTier.TIER_ZERO,
                    subscription: null,
                    error: null,
                };
            default:
                return {
                    status: null,
                    subscriptionTier: null,
                    subscription: null,
                    error: null,
                };
        }
    } catch (error) {
        return {
            status: null,
            subscriptionTier: null,
            subscription: null,
            error: handleSupabaseError(error),
        };
    }
};

export const checkFreeTrialStatus = async ({ userId }: { userId: string }) => {
    const supabase = createClient();

    try {
        const { data, error } = await supabase
            .from("free_trials")
            .select("*")
            .eq("user_id", userId)
            .single();

        if (error) throw error;

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
        return { status: null, freeTrial: null, error: handleSupabaseError(error) };
    }
};

export const fetchSubscriptionTier = async ({ stripePriceId }: { stripePriceId: string }) => {
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
        return { subscriptionTier: null, error: handleSupabaseError(error) };
    }
};
