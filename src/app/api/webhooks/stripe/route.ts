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

        const event = await verifyStripeWebhook({ body, signature });

        if (event.type === StripeWebhookEvents.CHECKOUT_SESSION_COMPLETED) {
            const session = await retrieveCheckoutSession({ sessionId: event.data.object.id });
            await handleCheckoutSessionCompleted({ session });
        } else {
            console.log(`Unhandled event: ${event.type}`);
        }

        return response.json({ received: true }, { status: 200 });
    } catch (error) {
        console.error("Error processing webhook:", error);
        return response.json({ error: "Webhook processing failed" }, { status: 500 });
    }
};
