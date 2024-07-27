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
