"use server";

import { StripeWebhookEvents } from "@/enums/StripeWebhookEvents";
import { retrieveCheckoutSession, verifyStripeWebhook } from "@/lib/stripe/stripeUtils";
import { handleCheckoutSessionCompleted } from "@/lib/subscriptions/subscriptionManagement";
import { NextRequest as request, NextResponse as response } from "next/server";

export const POST = async (req: request) => {
    try {
        const body = await req.text();
        const signature = req.headers.get("stripe-signature");

        if (!signature) {
            return response.json({ error: "There was no signature provided" }, { status: 400 });
        }

        // construct the event and check if the webhook is valid
        const event = await verifyStripeWebhook({ body, signature });

        switch (event.type) {
            case StripeWebhookEvents.CHECKOUT_SESSION_COMPLETED:
                const session = await retrieveCheckoutSession({ sessionId: event.data.object.id });
                await handleCheckoutSessionCompleted({ session });
                break;

            case StripeWebhookEvents.CUSTOMER_SUBSCRIPTION_UPDATED:
                break;

            case StripeWebhookEvents.CUSTOMER_SUBSCRIPTION_DELETED:
            default:
                break;
        }

        return response.json({ received: true }, { status: 200 });
    } catch (error) {
        console.error("Error processing webhook:", error);
        return response.json({ error: "Webhook processing failed" }, { status: 500 });
    }
};
