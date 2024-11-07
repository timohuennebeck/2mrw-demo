"use server";

import { StripeWebhookEvents } from "@/enums/StripeWebhookEvents";
import { queryClient } from "@/lib/qClient/qClient";
import { createSupabasePowerUserClient } from "@/services/integration/admin";
import {
    handleCheckoutSessionCompleted,
    handleSubscriptionUpdated,
} from "@/services/stripe/StripeWebhookService";
import { NextRequest as request, NextResponse as response } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

const _verifyStripeWebhook = async (body: string, signature: string) => {
    try {
        return stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err: unknown) {
        throw new Error("Invalid signature");
    }
};

const _retrieveCheckoutSession = async (sessionId: string) => {
    return await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["line_items"],
    });
};

const _getUserIdFromStripeCustomerId = async (customerId: string) => {
    const adminSupabase = await createSupabasePowerUserClient();
    const { data: userData, error: userError } = await adminSupabase
        .from("users")
        .select("id")
        .eq("stripe_customer_id", customerId)
        .single();

    if (userError) {
        throw new Error("User not found for stripe customer id: " + customerId);
    }

    return userData.id;
};

export const POST = async (req: request) => {
    try {
        const body = await req.text();
        const signature = req.headers.get("stripe-signature");

        if (!signature) {
            return response.json({ error: "There was no signature provided" }, { status: 400 });
        }

        // construct the event and check if the webhook is valid
        const event = await _verifyStripeWebhook(body, signature);
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const userId = await _getUserIdFromStripeCustomerId(customerId);

        switch (event.type) {
            case StripeWebhookEvents.CHECKOUT_SESSION_COMPLETED:
                const session = await _retrieveCheckoutSession(event.data.object.id);
                await handleCheckoutSessionCompleted(session, userId ?? "");

                if (userId) {
                    queryClient.invalidateQueries({ queryKey: ["subscription", userId] });
                }
                break;
            case StripeWebhookEvents.CUSTOMER_SUBSCRIPTION_UPDATED:
                await handleSubscriptionUpdated(event.data.object, userId);

                if (userId) {
                    queryClient.invalidateQueries({ queryKey: ["subscription", userId] });
                }
                break;
            default:
                break;
        }

        return response.json({ received: true }, { status: 200 });
    } catch (error) {
        console.error("Error processing webhook:", error);
        return response.json({ error: "Webhook processing failed" }, { status: 500 });
    }
};
