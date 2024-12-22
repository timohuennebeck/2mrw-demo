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
import {
    NextRequest as nextRequest,
    NextResponse as nextResponse,
} from "next/server";
import Stripe from "stripe";

const _getPurchasedPackage = (session: Stripe.Checkout.Session) => {
    return session.line_items?.data[0]?.price?.product as Stripe.Product;
};

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

export const POST = async (req: nextRequest) => {
    try {
        const body = await req.text();
        const signature = req.headers.get("stripe-signature");

        if (!signature) {
            return nextResponse.json({
                error: "There was no signature provided",
            }, { status: 400 });
        }

        const event = await _verifyStripeWebhook(body, signature);
        const subscription = event.data.object as Stripe.Subscription;

        switch (event.type) {
            case StripeWebhookEvents.CHECKOUT_SESSION_COMPLETED: {
                const customerId = subscription.customer as string;
                const user = await _getUserFromStripeCustomerId(customerId);

                const sessionId = event.data.object.id;
                const session = await _retrieveCheckoutSession(sessionId);

                const checkoutResult = await handleCheckoutCompleted(
                    session,
                    user.id,
                );
                if (checkoutResult.error) throw checkoutResult.error;

                sendLoopsTransactionalEmail({
                    type: EmailType.PURCHASED_SUBSCRIPTION,
                    email: user.email,
                    variables: {
                        purchasedPackage: _getPurchasedPackage(session).name,
                    },
                });

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

        return nextResponse.json({ received: true }, { status: 200 });
    } catch (error) {
        console.error("Error processing stripe webhook:", error);
        return nextResponse.json(
            { error: "Processing stripe webhook failed" },
            { status: 500 },
        );
    }
};
