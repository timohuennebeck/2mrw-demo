import PreOrderEmail from "@/emails/PreOrderEmail";
import { PreOrderEmailInterface } from "@/interfaces/PreOrderEmailInterface";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_API_KEY ?? "");
const stripeWebhook = process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET ?? "";
const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_EMAIL_API_KEY ?? "");

const sendPreOrderEmail = async ({
    customerEmail,
    customerFullName,
    purchasedPackage,
}: PreOrderEmailInterface) => {
    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: customerEmail,
        subject: `Order Confirmation - ${purchasedPackage}`,
        react: PreOrderEmail({
            customerFullName,
            purchasedPackage,
            estimatedLaunchDate: "September 15, 2024",
            companyTitle: "Forj",
            customerSupportEmail: "hello@joinforj.com",
        }),
    });
};

export async function POST(req: NextRequest) {
    try {
        const body = await req.text();
        const signature = req.headers.get("stripe-signature");

        if (!signature) {
            return NextResponse.json({ error: "There was no signature provided" }, { status: 400 });
        }

        let event: Stripe.Event;

        // checks if the stripe webhook event is legit
        event = stripe.webhooks.constructEvent(body, signature, stripeWebhook);
        try {
        } catch (err: any) {
            console.error(`Webhook signature verification failed: ${err.message}`);
            return NextResponse.json({ error: err.message }, { status: 400 });
        }

        switch (event.type) {
            // checks if the user has completed the checkout
            case "checkout.session.completed":
                const session = await stripe.checkout.sessions.retrieve(event.data.object.id, {
                    expand: ["line_items"],
                });

                try {
                    sendPreOrderEmail({
                        customerEmail: session?.customer_details?.email ?? "",
                        customerFullName: session?.customer_details?.name ?? "",
                        purchasedPackage: session.line_items?.data[0].description ?? "",
                    });
                } catch (err) {
                    console.log("Error sending email", err);
                }

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
