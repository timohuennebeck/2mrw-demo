"use server";

import { createClient } from "@/services/integration/server";
import moment from "moment";
import { stripe } from "./client";
import { handleSupabaseError } from "@/utils/errors/supabaseError";

const _getStripeCustomerIdFromSupabase = async (userId: string) => {
    const supabase = await createClient();
    const { data, error: userError } = await supabase
        .from("users")
        .select("stripe_customer_id")
        .eq("id", userId)
        .single();

    if (userError) {
        throw new Error("Error getting stripe customer id from supabase: " + userError);
    }

    return { stripeCustomerId: data?.stripe_customer_id, error: null };
};

const _getStripeCustomerIdFromStripe = async (email: string) => {
    const customers = await stripe.customers.list({
        email: email,
        limit: 1,
    });

    return { stripeCustomerId: customers.data[0]?.id ?? null, error: null };
};

const _updateUserStripeCustomerId = async (userId: string, stripeCustomerId: string) => {
    try {
        const supabase = await createClient();
        const { error } = await supabase
            .from("users")
            .update({
                stripe_customer_id: stripeCustomerId,
                updated_at: moment().toISOString(),
            })
            .eq("id", userId);

        if (error) throw error;
        return { success: true, error: null };
    } catch (error) {
        return {
            success: null,
            error: handleSupabaseError({ error, fnTitle: "_updateUserStripeCustomerId" }),
        };
    }
};

const _createStripeCustomer = async (email: string) => {
    const newCustomer = await stripe.customers.create({ email });
    return { stripeCustomerId: newCustomer.id, error: null };
};

// Public function for getting/creating customer ID
export const getStripeCustomerId = async () => {
    const supabaseClient = await createClient();
    const {
        data: { user },
    } = await supabaseClient.auth.getUser();
    const userId = user?.id ?? "";
    const userEmail = user?.email ?? "";

    try {
        if (userId) {
            const { stripeCustomerId } = await _getStripeCustomerIdFromSupabase(userId);
            if (stripeCustomerId) return stripeCustomerId;
        }

        const { stripeCustomerId: existingStripeId } =
            await _getStripeCustomerIdFromStripe(userEmail);

        if (existingStripeId) {
            if (userId) {
                await _updateUserStripeCustomerId(userId, existingStripeId);
            }
            return existingStripeId;
        }

        const { stripeCustomerId: newStripeId } = await _createStripeCustomer(userEmail);
        if (userId) {
            await _updateUserStripeCustomerId(userId, newStripeId);
        }

        return newStripeId;
    } catch (error) {
        console.error("Error getting or creating Stripe customer:", error);
        throw error;
    }
};
