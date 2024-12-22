"use server";

import { isOneTimePaymentEnabled } from "@/config";
import { InitiateStripeCheckoutProcessParams } from "@/interfaces";
import { stripe } from "./client";
import { getStripeCustomerId } from "./stripeCustomer";

export const createStripeCheckout = async ({
    stripePriceId,
    successUrl,
    cancelUrl,
}: InitiateStripeCheckoutProcessParams) => {
    const { stripeCustomerId, error } = await getStripeCustomerId();
    if (error) return { checkoutUrl: null, error };

    try {
        const session = await stripe.checkout.sessions.create({
            customer: stripeCustomerId,
            line_items: [{ price: stripePriceId, quantity: 1 }],
            mode: isOneTimePaymentEnabled() ? "payment" : "subscription",
            success_url: successUrl,
            cancel_url: cancelUrl,
        });

        return { checkoutUrl: session.url, error: null };
    } catch (error) {
        return {
            checkoutUrl: null,
            error: "Error creating checkout session",
        };
    }
};

export const createStripeBillingPortal = async (stripeCustomerId: string) => {
    try {
        const { url } = await stripe.billingPortal.sessions.create({
            customer: stripeCustomerId,
            return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/billing`,
        });

        return { portalUrl: url, error: null };
    } catch (error) {
        return { portalUrl: null, error: "Error creating billing portal" };
    }
};

export const getStripeCreditCardDetails = async (stripeCustomerId: string) => {
    try {
        const paymentMethods = await stripe.paymentMethods.list({
            customer: stripeCustomerId ?? "",
            type: "card",
        });

        const card = paymentMethods.data[0].card;

        return {
            lastFourDigits: card?.last4,
            brand: card?.brand,
            error: null,
        };
    } catch (error) {
        return {
            lastFourDigits: null,
            brand: null,
            error: "Error fetching credit card details",
        };
    }
};
