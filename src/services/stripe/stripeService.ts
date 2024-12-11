"use server";

import { isOneTimePaymentEnabled } from "@/config";
import { InitiateStripeCheckoutProcessParams } from "@/interfaces";
import { stripe } from "./client";
import { getStripeCustomerId } from "./stripeCustomer";

const _updateCustomerSubscription = async ({
    existingSubscriptionId,
    stripePriceId,
    successUrl,
}: {
    existingSubscriptionId: string;
    stripePriceId: string;
    successUrl: string;
}) => {
    const existingSubscription = await stripe.subscriptions.retrieve(existingSubscriptionId);
    const subscriptionItemId = existingSubscription.items.data[0].id;

    await stripe.subscriptions.update(existingSubscriptionId, {
        items: [
            {
                id: subscriptionItemId,
                price: stripePriceId,
            },
        ],
        proration_behavior: "always_invoice",
    });

    return { checkoutUrl: successUrl, error: null };
};

const _createStripeCheckoutSession = async ({
    stripeCustomerId,
    stripePriceId,
    successUrl,
    cancelUrl,
}: {
    stripeCustomerId: string;
    stripePriceId: string;
    successUrl: string;
    cancelUrl: string;
}) => {
    const session = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        line_items: [{ price: stripePriceId, quantity: 1 }],
        mode: isOneTimePaymentEnabled() ? "payment" : "subscription",
        success_url: successUrl,
        cancel_url: cancelUrl,
    });

    return { checkoutUrl: session.url, error: null };
};

// export const cancelStripeSubscription = async (stripeSubscriptionId: string) => {
//     try {
//         await stripe.subscriptions.update(stripeSubscriptionId, {
//             cancel_at_period_end: true,
//         });
//         return { error: null };
//     } catch (error) {
//         console.error("Error canceling Stripe subscription:", error);
//         return { error };
//     }
// };

export const initiateStripeCheckoutProcess = async ({
    stripePriceId,
    successUrl,
    cancelUrl,
    existingSubscriptionId,
}: InitiateStripeCheckoutProcessParams) => {
    if (existingSubscriptionId) {
        return _updateCustomerSubscription({ existingSubscriptionId, stripePriceId, successUrl });
    }

    const { stripeCustomerId, error } = await getStripeCustomerId();
    if (error) return { checkoutUrl: null, error };

    return _createStripeCheckoutSession({ stripeCustomerId, stripePriceId, successUrl, cancelUrl });
};
