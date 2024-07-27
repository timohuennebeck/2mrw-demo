import Stripe from "stripe";

export interface SendPostPurchaseEmailParams {
    session: Stripe.Checkout.Session;
    stripePriceId: string;
    isPreOrder: boolean;
}
