"use server";

import { InitiateStripeCheckoutProcessParams } from "@/interfaces/StripeInterfaces";
import Stripe from "stripe";
import { isOneTimePaymentEnabled } from "@/config/paymentConfig";
import axios from "axios";
import { getStripeCustomerId } from "./stripeCustomer";
import { stripe } from "./client";

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
        const subscriptionItemId = existingSubscription.items.data[0].id;

        await stripe.subscriptions.update(existingSubscriptionId, {
            items: [
                {
                    id: subscriptionItemId,
                    price: stripePriceId,
                },
            ],
            proration_behavior: "always_invoice",
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
