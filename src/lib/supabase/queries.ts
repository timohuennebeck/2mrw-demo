import { PurchasedSubscription } from "@/interfaces/PurchasedSubscription";
import { createClient } from "./client";
import { FreeTrial } from "@/interfaces/FreeTrial";
import { FreeTrialStatus } from "@/enums/FreeTrialStatus";
import { SubscriptionStatus } from "@/enums/SubscriptionStatus";
import { Product } from "@/interfaces/Product";
import { User } from "@/interfaces/User";
import {
    CheckFreeTrialStatusParams,
    CheckSubscriptionStatusParams,
    CheckUserExistsParams,
} from "./supabaseInterfaces";
import { SupabaseClient } from "@supabase/supabase-js";

const supabase = createClient();

export const handleSupabaseError = (error: unknown) => {
    console.error("Supabase error:", error);

    return { error };
};

export const fetchSupabaseUser = async ({ supabase }: { supabase: SupabaseClient }) => {
    try {
        // TODO: this causes a 406, not acceptable error
        const {
            data: { user },
            error,
        } = await supabase.auth.getUser();

        if (error) throw error;

        return { user, error: null };
    } catch (error) {
        return { user: null, error: handleSupabaseError(error) };
    }
};

export const fetchProducts = async () => {
    try {
        const { data: products, error } = await supabase.from("products").select("*");

        if (error) throw error;

        return { products: products as Product[], error: null };
    } catch (error) {
        return { products: null, error: handleSupabaseError(error) };
    }
};

export const checkUserExists = async ({ userEmail }: CheckUserExistsParams) => {
    try {
        const { data: user, error } = await supabase
            .from("users")
            .select("*")
            .eq("email", userEmail)
            .single();

        if (error) throw error;

        return { user: user as User, error: null };
    } catch (error) {
        return { user: null, error: handleSupabaseError(error) };
    }
};

export const checkSubscriptionStatus = async ({ userId }: CheckSubscriptionStatusParams) => {
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
                    subscription: subscription,
                    error: null,
                };

            case SubscriptionStatus.NOT_PURCHASED:
                return {
                    status: SubscriptionStatus.NOT_PURCHASED,
                    subscription: null,
                    error: null,
                };
            default:
                return {
                    status: null,
                    subscription: null,
                    error: null,
                };
        }
    } catch (error) {
        return { status: null, subscription: null, error: handleSupabaseError(error) };
    }
};

export const checkFreeTrialStatus = async ({ userId }: CheckFreeTrialStatusParams) => {
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
