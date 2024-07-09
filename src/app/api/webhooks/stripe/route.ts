import { NextResponse, NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_API_KEY ?? "");
const webhookSecret = process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET ?? "";

export async function POST(req: NextRequest) {
    try {
        const body = await req.text();
        const signature = req.headers.get("stripe-signature");

        if (!signature) {
            return NextResponse.json({ error: "There was no signature provided" }, { status: 400 });
        }

        let event: Stripe.Event;

        // checks if the stripe webhook event is legit
        try {
            event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
        } catch (err: any) {
            console.error(`Webhook signature verification failed: ${err.message}`);
            return NextResponse.json({ error: err.message }, { status: 400 });
        }

        switch (event.type) {
            // checks if the user has completed the checkout
            case "checkout.session.completed":
                const session = event.data.object as Stripe.Checkout.Session;
                break;
            // checks if the user has cancelled their subscription
            case "customer.subscription.deleted":
                const deletedSubscription = event.data.object as Stripe.Subscription;
                break;
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (err: any) {
        console.error("Error processing webhook:", err);
        return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
    }
}
