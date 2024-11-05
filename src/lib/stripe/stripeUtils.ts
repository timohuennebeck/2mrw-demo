"use server";

import { isOneTimePaymentEnabled } from "@/config/paymentConfig";
import { InitiateStripeCheckoutProcessParams } from "@/interfaces/StripeInterfaces";
import { updateUserStripeCustomerId } from "@/services/supabase/admin";
import axios from "axios";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

export const cancelStripeSubscription = async (stripeSubscriptionId: string) => {
    try {
        await stripe.subscriptions.cancel(stripeSubscriptionId);
        return { success: true, error: null };
    } catch (error) {
        console.error("Error canceling Stripe subscription:", error);
        return { success: false, error };
    }
};

export const initiateStripeCheckoutProcess = async ({
    userEmail,
    stripePriceId,
    successUrl,
    cancelUrl,
    existingSubscriptionId,
}: InitiateStripeCheckoutProcessParams) => {
    const stripeCustomerId = await getStripeCustomerId(userEmail);
    if (!stripeCustomerId) throw new Error("No stripe customer ID found");

    if (existingSubscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(existingSubscriptionId);

        // get the subscription item ID (each subscription has at least one item)
        const subscriptionItemId = subscription.items.data[0].id;

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

export const updateStripeCustomer = async (
    customerId: string,
    updates: { name?: string; email?: string },
) => {
    // only include fields that are provided
    const updateData: { name?: string; email?: string } = {};
    if (updates.name) updateData.name = updates.name;
    if (updates.email) updateData.email = updates.email;

    // update the customer in Stripe only if there are changes
    if (Object.keys(updateData).length !== 0) {
        return await stripe.customers.update(customerId, updateData);
    }
};

export const getStripeCustomerId = async (email: string, userId?: string) => {
    try {
        const customers = await stripe.customers.list({
            email: email,
            limit: 1,
        });

        if (customers.data.length !== 0) {
            return customers.data[0].id;
        }

        // create new customer if no customer exists
        const newCustomer = await stripe.customers.create({
            email: email,
        });

        if (userId) {
            await updateUserStripeCustomerId(userId, newCustomer.id);
        }

        return newCustomer.id;
    } catch (error) {
        console.error("Error getting/creating Stripe customer:", error);
        throw error;
    }
};

export const getStripeCustomerCreditCardDetails = async (customerId: string) => {
    const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: "card",
    });

    const defaultPaymentMethod = paymentMethods.data[0];

    if (!defaultPaymentMethod) {
        return null;
    }

    const card = defaultPaymentMethod.card;

    return {
        brand: card?.brand ?? "",
        last4Digits: card?.last4 ?? "",
        expirationMonth: card?.exp_month ?? 0,
        expirationYear: card?.exp_year ?? 0,
    };
};

export const handleStripePortalSession = async (stripeCustomerId: string) => {
    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_SITE_URL}/api/stripe/create-portal-session`,
            {
                stripeCustomerId,
            },
        );

        const { url } = response.data;
        return url;
    } catch (error) {
        console.error("Failed to redirect to customer portal:", error);
    }
};
