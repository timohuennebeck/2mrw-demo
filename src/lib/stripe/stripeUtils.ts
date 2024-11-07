"use server";

import { InitiateStripeCheckoutProcessParams } from "@/interfaces/StripeInterfaces";
import { createClient } from "@/services/integration/server";
import moment from "moment";
import Stripe from "stripe";
import { handleSupabaseError } from "../helper/SupabaseHelper";
import { isOneTimePaymentEnabled } from "@/config/paymentConfig";
import axios from "axios";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

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

export const getStripeCustomerId = async () => {
    /**
     * IMPORTANT: Do NOT use this inside the stripe webhook handler as it will cause an infinite loop
     * because if no user exists this function will create a new user in stripe, thus triggering the webhook handler again
     */

    const supabaseClient = await createClient();

    const {
        data: { user },
    } = await supabaseClient.auth.getUser();
    const userId = user?.id ?? "";
    const userEmail = user?.email ?? "";

    try {
        // case I: If userId is provided, check Supabase first
        if (userId) {
            const { stripeCustomerId } = await _getStripeCustomerIdFromSupabase(userId);
            if (stripeCustomerId) return stripeCustomerId;
        }

        // case II: check Stripe (for both with and without userId)
        const { stripeCustomerId: existingStripeId } =
            await _getStripeCustomerIdFromStripe(userEmail);

        if (existingStripeId) {
            // update Supabase if we have a userId
            if (userId) {
                await _updateUserStripeCustomerId(userId, existingStripeId);
            }
            return existingStripeId;
        }

        // case III: create new customer if none exists
        const { stripeCustomerId: newStripeId } = await _createStripeCustomer(userEmail);

        // update Supabase if we have a userId
        if (userId) {
            await _updateUserStripeCustomerId(userId, newStripeId);
        }

        return newStripeId;
    } catch (error) {
        console.error("Error getting or creating Stripe customer:", error);
        throw error;
    }
};

export const cancelStripeSubscription = async (stripeSubscriptionId: string) => {
    try {
        await stripe.subscriptions.update(stripeSubscriptionId, {
            cancel_at_period_end: true,
        });
        return { success: true, error: null };
    } catch (error) {
        console.error("Error canceling Stripe subscription:", error);
        return { success: false, error };
    }
};

export const initiateStripeCheckoutProcess = async ({
    stripePriceId,
    successUrl,
    cancelUrl,
    existingSubscriptionId,
}: InitiateStripeCheckoutProcessParams) => {
    const stripeCustomerId = await getStripeCustomerId();
    if (!stripeCustomerId) throw new Error("Stripe customer id is missing!");

    if (existingSubscriptionId) {
        const existingSubscription = await stripe.subscriptions.retrieve(existingSubscriptionId);

        // get the subscription item id (each subscription has at least one item)
        const subscriptionItemId = existingSubscription.items.data[0].id;

        // if user has an existing subscription, update it immediately
        await stripe.subscriptions.update(existingSubscriptionId, {
            items: [
                {
                    id: subscriptionItemId,
                    price: stripePriceId,
                },
            ],
            proration_behavior: "always_invoice", // or 'create_prorations' based on your needs
        });

        return { checkoutUrl: successUrl };
    } else {
        const session = await stripe.checkout.sessions.create({
            customer: stripeCustomerId,
            line_items: [{ price: stripePriceId, quantity: 1 }],
            mode: isOneTimePaymentEnabled() ? "payment" : "subscription",
            success_url: successUrl,
            cancel_url: cancelUrl,
        });

        return { checkoutUrl: session.url };
    }
};

export const handleStripePortalSession = async (stripeCustomerId: string) => {
    try {
        const fetchUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/stripe/create-portal-session`;
        const response = await axios.post(fetchUrl, { stripeCustomerId });

        const { url } = response.data;
        return url;
    } catch (error) {
        console.error("Failed to redirect to customer portal:", error);
    }
};
