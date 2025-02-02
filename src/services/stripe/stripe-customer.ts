"use server";

import { createClient } from "@/services/integration/server";
import moment from "moment";
import { stripe } from "./client";
import { handleError } from "@/utils/errors/error";

const _getStripeCustomerIdFromSupabase = async (userId: string) => {
    try {
        const supabase = await createClient();

        const { data } = await supabase
            .from("users")
            .select("stripe_customer_id")
            .eq("id", userId)
            .single();

        return { stripeCustomerId: data?.stripe_customer_id, error: null };
    } catch (error) {
        return {
            stripeCustomerId: null,
            error: handleError(error, "_getStripeCustomerIdFromSupabase"),
        };
    }
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
            error: handleError(error, "_getStripeCustomerIdFromStripe"),
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

        if (error) return { success: false, error };

        return { success: true, error: null };
    } catch (error) {
        return {
            success: false,
            error: handleError(error, "_updateUserStripeCustomerId"),
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
            error: handleError(error, "_createStripeCustomer"),
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

        const existingId = await _getStripeCustomerIdFromSupabase(userId);
        if (existingId.stripeCustomerId) {
            return {
                stripeCustomerId: existingId.stripeCustomerId,
                error: null,
            };
        }

        const stripeId = await _getStripeCustomerIdFromStripe(userEmail);
        if (stripeId.stripeCustomerId) {
            await _updateUserStripeCustomerId(
                userId,
                stripeId.stripeCustomerId,
            );
            return { stripeCustomerId: stripeId.stripeCustomerId, error: null };
        }

        const newId = await _createStripeCustomer(userEmail);
        if (newId.stripeCustomerId) {
            await _updateUserStripeCustomerId(
                userId,
                newId.stripeCustomerId,
            );
            return { stripeCustomerId: newId.stripeCustomerId, error: null };
        }

        return {
            stripeCustomerId: null,
            error: "Error finding or creating a stripe customer id!",
        };
    } catch (error) {
        return {
            stripeCustomerId: null,
            error: handleError(error, "getStripeCustomerId"),
        };
    }
};
