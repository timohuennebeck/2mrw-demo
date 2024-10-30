"use server";

import { InitiateStripeCheckoutProcessParams } from "@/interfaces/StripeInterfaces";
import axios from "axios";
import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY ?? "");

export const initiateStripeCheckoutProcess = async ({
    userId,
    userEmail,
    stripePriceId,
}: InitiateStripeCheckoutProcessParams) => {
    const session = await stripe.checkout.sessions.create({
        customer_email: userEmail,
        line_items: [{ price: stripePriceId, quantity: 1 }],
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/choose-pricing-plan?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/choose-pricing-plan`,
        metadata: { userId: userId },
    });

    return { checkoutUrl: session.url };
};

export const getStripeCustomerId = async (email: string) => {
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

export const handleStripePortalSession = async (customerId: string) => {
    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_SITE_URL}/api/stripe/create-portal-session`,
            {
                customerId,
            },
        );

        const { url } = response.data;
        return url;
    } catch (error) {
        console.error("Failed to redirect to customer portal:", error);
    }
};
