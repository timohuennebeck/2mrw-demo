"use server";

import { VerifyStripeWebhookParams } from "@/interfaces/StripeInterfaces";
import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY ?? "");

export const verifyStripeWebhook = async ({ body, signature }: VerifyStripeWebhookParams) => {
    try {
        return stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET!,
        );
    } catch (err: unknown) {
        throw new Error("Invalid signature");
    }
};

export const retrieveCheckoutSession = async ({ sessionId }: { sessionId: string }) => {
    return await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["line_items"],
    });
};

export const initiateStripeCheckoutProcess = async ({
    userId,
    userEmail,
    stripePriceId,
}: {
    userId: string;
    userEmail: string;
    stripePriceId: string;
}) => {
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
