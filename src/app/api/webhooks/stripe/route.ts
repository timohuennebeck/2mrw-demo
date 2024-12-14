"use server";

import { StripeWebhookEvents } from "@/enums";
import { createSupabasePowerUserClient } from "@/services/integration/admin";
import { stripe } from "@/services/stripe/client";
import {
    handleCancelSubscription,
    handleCheckoutSessionCompleted,
    handleUpdateSubscription,
} from "@/services/stripe/stripeWebhook";
import { useQueryClient } from "@tanstack/react-query";
import { NextRequest as nextRequest, NextResponse as nextResponse } from "next/server";
import Stripe from "stripe";

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

export const POST = async (req: nextRequest) => {
    const queryClient = useQueryClient();

    try {
        const body = await req.text();
        const signature = req.headers.get("stripe-signature");

        if (!signature) {
            return nextResponse.json({ error: "There was no signature provided" }, { status: 400 });
        }

        // construct the event and check if the webhook is valid
        const event = await _verifyStripeWebhook(body, signature);
        const subscription = event.data.object as Stripe.Subscription;

        switch (event.type) {
            case StripeWebhookEvents.CHECKOUT_SESSION_COMPLETED: {
                const customerId = subscription.customer as string;
                const userId = await _getUserIdFromStripeCustomerId(customerId);

                const session = await _retrieveCheckoutSession(event.data.object.id);
                await handleCheckoutSessionCompleted(session, userId ?? "");

                if (userId) {
                    await queryClient.invalidateQueries({ queryKey: ["subscription", userId] });
                }
                break;
            }
            case StripeWebhookEvents.CUSTOMER_SUBSCRIPTION_UPDATED: {
                const customerId = subscription.customer as string;
                const userId = await _getUserIdFromStripeCustomerId(customerId);

                if (subscription.cancel_at_period_end) {
                    /**
                     * checks if the subscription is set to cancel at the end of the current period
                     * if it is, cancel the subscripton
                     */
                    await handleCancelSubscription(userId, subscription);
                } else {
                    await handleUpdateSubscription(event.data.object, userId);
                }

                if (userId) {
                    await queryClient.invalidateQueries({ queryKey: ["subscription", userId] });
                }
                break;
            }
            case StripeWebhookEvents.CUSTOMER_SUBSCRIPTION_TRIAL_WILL_END: {
                break; // notify user that their free trial is ending in three days
            }
            default:
                break;
        }

        return nextResponse.json({ received: true }, { status: 200 });
    } catch (error) {
        console.error("Error processing webhook:", error);
        return nextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
    }
};
