"use server";

import { StripeWebhookEvents } from "@/enums/StripeWebhookEvents";
import { VerifyStripeWebhookParams } from "@/interfaces/StripeInterfaces";
import { queryClient } from "@/lib/qClient/qClient";
import {
    handleCheckoutSessionCompleted,
    handleSubscriptionDeleted,
    handleSubscriptionUpdated,
} from "@/lib/subscriptions/subscriptionManagement";
import { getUserId } from "@/services/supabase/queries";
import { NextRequest as request, NextResponse as response } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

const _verifyStripeWebhook = async ({ body, signature }: VerifyStripeWebhookParams) => {
    try {
        return stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!,
        );
    } catch (err: unknown) {
        throw new Error("Invalid signature");
    }
};

const _retrieveCheckoutSession = async ({ sessionId }: { sessionId: string }) => {
    return await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["line_items"],
    });
};

export const POST = async (req: request) => {
    try {
        const body = await req.text();
        const signature = req.headers.get("stripe-signature");

        if (!signature) {
            return response.json({ error: "There was no signature provided" }, { status: 400 });
        }

        // construct the event and check if the webhook is valid
        const event = await _verifyStripeWebhook({ body, signature });
        const userId = await getUserId();

        switch (event.type) {
            case StripeWebhookEvents.CHECKOUT_SESSION_COMPLETED:
                const session = await _retrieveCheckoutSession({ sessionId: event.data.object.id });
                await handleCheckoutSessionCompleted({
                    session,
                    userId: userId ?? "",
                });

                if (userId) {
                    queryClient.invalidateQueries({ queryKey: ["freeTrial", userId] });
                    queryClient.invalidateQueries({ queryKey: ["subscription", userId] });
                }
                break;
            case StripeWebhookEvents.CUSTOMER_SUBSCRIPTION_UPDATED:
                await handleSubscriptionUpdated({
                    subscription: event.data.object,
                    userId: userId ?? "",
                });

                if (userId) {
                    queryClient.invalidateQueries({
                        queryKey: ["subscription", userId],
                    });
                }
                break;
            case StripeWebhookEvents.CUSTOMER_SUBSCRIPTION_DELETED:
                await handleSubscriptionDeleted(userId ?? "");

                if (userId) {
                    queryClient.invalidateQueries({
                        queryKey: ["subscription", userId],
                    });
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
