"use server";

import { createClient } from "@/services/integration/server";
import moment from "moment";
import { stripe } from "./client";
import { handleSupabaseError } from "@/utils/errors/supabaseError";

const _getStripeCustomerIdFromSupabase = async (userId: string) => {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("users")
        .select("stripe_customer_id")
        .eq("id", userId)
        .single();

    if (error) {
        return {
            stripeCustomerId: null,
            error: handleSupabaseError(
                error,
                "_getStripeCustomerIdFromSupabase",
            ),
        };
    }

    return { stripeCustomerId: data?.stripe_customer_id, error: null };
};

const _getStripeCustomerIdFromStripe = async (email: string) => {
    try {
        const customers = await stripe.customers.list({
            email: email,
            limit: 1,
        });

        return { stripeCustomerId: customers.data[0]?.id, error: null };
    } catch (error) {
        return {
            stripeCustomerId: null,
            error: handleSupabaseError(error, "_getStripeCustomerIdFromStripe"),
        };
    }
};

const _updateUserStripeCustomerId = async (
    userId: string,
    stripeCustomerId: string,
) => {
    const supabase = await createClient();

    try {
        const { error } = await supabase
            .from("users")
            .update({
                stripe_customer_id: stripeCustomerId,
                updated_at: moment().toISOString(),
            })
            .eq("id", userId);

        if (error) throw error;

        return { error: null };
    } catch (error) {
        return {
            error: handleSupabaseError(error, "_updateUserStripeCustomerId"),
        };
    }
};

const _createStripeCustomer = async (email: string) => {
    try {
        const newCustomer = await stripe.customers.create({ email });
        return { stripeCustomerId: newCustomer.id, error: null };
    } catch (error) {
        return {
            stripeCustomerId: null,
            error: handleSupabaseError(error, "_createStripeCustomer"),
        };
    }
};

export const getStripeCustomerId = async () => {
    const supabaseClient = await createClient();
    const {
        data: { user },
    } = await supabaseClient.auth.getUser();

    const userId = user?.id ?? "";
    const userEmail = user?.email ?? "";

    try {
        /**
         * checks if the user has a stripe customer id in supabase, if so, return it
         * if not, check if user has a stripe customer id in stripe and update supabase user with it
         * if not, create a new stripe customer and update supabase user with it
         */

        if (!userId) {
            return { stripeCustomerId: null, error: "UserId is missing!" };
        }

        const { stripeCustomerId: existingId } =
            await _getStripeCustomerIdFromSupabase(userId);
        if (existingId) {
            return { stripeCustomerId: existingId, error: null };
        }

        const { stripeCustomerId: stripeId } =
            await _getStripeCustomerIdFromStripe(userEmail);
        if (stripeId) {
            await _updateUserStripeCustomerId(userId, stripeId);
            return { stripeCustomerId: stripeId, error: null };
        }

        const { stripeCustomerId: newId } = await _createStripeCustomer(
            userEmail,
        );
        if (newId) {
            await _updateUserStripeCustomerId(userId, newId ?? "");
            return { stripeCustomerId: newId, error: null };
        }

        return {
            stripeCustomerId: null,
            error: "Error finding or creating a stripe customer id!",
        };
    } catch (error) {
        return {
            stripeCustomerId: null,
            error: handleSupabaseError(error, "getStripeCustomerId"),
        };
    }
};
