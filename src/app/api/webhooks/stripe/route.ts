import { EmailType, StripeWebhookEvents } from "@/enums";
import { User } from "@/interfaces";
import { createSupabasePowerUserClient } from "@/services/integration/admin";
import { sendLoopsTransactionalEmail } from "@/services/loops/loopsService";
import { stripe } from "@/services/stripe/client";
import {
    handleCancelSubscription,
    handleCheckoutCompleted,
    handleUpdateSubscription,
} from "@/services/stripe/stripeWebhook";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const _verifyStripeWebhook = async (body: string, signature: string) => {
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

const _retrieveCheckoutSession = async (sessionId: string) => {
    try {
        return await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ["line_items", "line_items.data.price.product"],
        });
    } catch (error) {
        throw new Error("Failed to retrieve checkout session");
    }
};

const _getUserFromStripeCustomerId = async (customerId: string) => {
    const adminSupabase = await createSupabasePowerUserClient();

    const { data: userData, error: userError } = await adminSupabase
        .from("users")
        .select("*")
        .eq("stripe_customer_id", customerId)
        .single();

    if (userError) {
        throw new Error("User not found for stripe customer id: " + customerId);
    }

    return userData as User;
};

const _cancelExistingFreeTrialsInStripe = async (userId: string) => {
    const adminSupabase = await createSupabasePowerUserClient();

    const { data: existingTrial } = await adminSupabase
        .from("free_trials")
        .select("stripe_subscription_id")
        .eq("user_id", userId)
        .single();

    if (existingTrial?.stripe_subscription_id) {
        try {
            await stripe.subscriptions.cancel(
                existingTrial.stripe_subscription_id,
            );
        } catch (cancelError) {
            console.error("Error cancelling trial subscription:", cancelError); // continue even if cancellation fails
        }
    }
};

export const POST = async (req: NextRequest) => {
    try {
        const body = await req.text();
        const signature = req.headers.get("stripe-signature");

        if (!signature) {
            console.error("Webhook Error: Missing stripe signature");
            return NextResponse.json({
                error: "There was no signature provided",
            }, { status: 400 });
        }

        let event;
        try {
            event = await _verifyStripeWebhook(body, signature);
        } catch (err) {
            console.error("Webhook Error: Signature verification failed", err);
            return NextResponse.json({
                error: `Webhook signature verification failed: ${(err as Error).message}`,
            }, { status: 400 });
        }

        const subscription = event.data.object as Stripe.Subscription;
        console.log("Webhook Event Type:", event.type);

        switch (event.type) {
            case StripeWebhookEvents.CHECKOUT_SESSION_COMPLETED: {
                try {
                    const customerId = subscription.customer as string;
                    const user = await _getUserFromStripeCustomerId(customerId);

                    const sessionId = event.data.object.id;
                    const session = await _retrieveCheckoutSession(sessionId);

                    const isRecurringPayment = session.mode === "subscription";
                    if (isRecurringPayment) {
                        await _cancelExistingFreeTrialsInStripe(user.id); // cancels user's existing free trial when a user purchases a subscription
                    }

                    const checkoutResult = await handleCheckoutCompleted(
                        session,
                        user.id,
                    );
                    if (checkoutResult.error) throw checkoutResult.error;
                } catch (err) {
                    console.error("Webhook Error: Checkout session handling failed", err);
                    throw new Error(`Checkout session handling failed: ${(err as Error).message}`);
                }
                break;
            }
            case StripeWebhookEvents.CUSTOMER_SUBSCRIPTION_UPDATED: {
                const customerId = subscription.customer as string;
                const user = await _getUserFromStripeCustomerId(customerId);

                if (subscription.cancel_at_period_end) {
                    /**
                     * checks if the subscription is set to cancel at the end of the current period
                     * if it is, cancel the subscripton
                     */

                    const subscriptionEndDate = moment.unix(
                        subscription.current_period_end,
                    ).format("Do [of] MMMM, YYYY");

                    sendLoopsTransactionalEmail({
                        type: EmailType.CANCELLED_SUBSCRIPTION,
                        email: user.email,
                        variables: {
                            endDate: subscriptionEndDate,
                            feedbackFormUrl:
                                `${process.env.NEXT_PUBLIC_APP_URL}/app/feedback`,
                        },
                    });

                    const cancelResult = await handleCancelSubscription(
                        user.id,
                        subscription,
                    );
                    if (cancelResult.error) throw cancelResult.error;
                } else {
                    const updateResult = await handleUpdateSubscription(
                        event.data.object,
                        user.id,
                    );
                    if (updateResult.error) throw updateResult.error;
                }
                break;
            }
            case StripeWebhookEvents.CUSTOMER_SUBSCRIPTION_TRIAL_WILL_END: {
                const customerId = subscription.customer as string;
                const user = await _getUserFromStripeCustomerId(customerId);

                sendLoopsTransactionalEmail({
                    type: EmailType.FREE_TRIAL_EXPIRES_SOON,
                    email: user.email,
                    variables: {
                        upgradeUrl:
                            `${process.env.NEXT_PUBLIC_APP_URL}/app/billing`,
                    },
                });

                break; // notify user that their free trial is ending in three days
            }
            default:
                break;
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (error: unknown) {
        console.error("Webhook Error:", {
            message: (error as Error).message,
            stack: (error as Error).stack,
            type: (error as Error).constructor.name
        });
        
        return NextResponse.json(
            { error: `Webhook failed: ${(error as Error).message}` },
            { status: 500 },
        );
    }
};
