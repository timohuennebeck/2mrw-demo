"use server";

import { FreeTrialStatus } from "@/app/enums/FreeTrialStatus";
import { StripePriceId } from "@/config/subscriptionPlans";
import { extractSubscriptionPlanDetails } from "@/helper/extractSubscriptionPlanDetails";
import { endUserFreeTrial, updateUserSubscriptionStatus } from "@/utils/supabase/admin";
import { checkFreeTrialStatus, checkUserExists } from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/server";
import axios from "axios";
import { NextRequest as request, NextResponse as response } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_API_KEY ?? "");
const stripeWebhook = process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET ?? "";

const supabase = createClient();

export async function POST(req: request) {
    try {
        const body = await req.text();
        const signature = req.headers.get("stripe-signature");

        if (!signature) {
            return response.json({ error: "There was no signature provided" }, { status: 400 });
        }

        let event: Stripe.Event;

        try {
            // checks if the stripe webhook event is legit
            event = stripe.webhooks.constructEvent(body, signature, stripeWebhook);
        } catch (err: any) {
            console.error(`Webhook signature verification failed: ${err.message}`);
            return response.json({ error: err.message }, { status: 400 });
        }

        switch (event.type) {
            // checks if the user has completed the checkout
            case "checkout.session.completed":
                const session = await stripe.checkout.sessions.retrieve(event.data.object.id, {
                    expand: ["line_items"],
                });

                const userEmail = session?.customer_details?.email;
                const stripePriceId = session.line_items?.data[0].price?.id;

                if (userEmail && stripePriceId) {
                    const user = await checkUserExists({ userEmail });
                    const { status } = await checkFreeTrialStatus({ userId: user.id });

                    if (!user) return;

                    // if a user purchases another product, his stripePriceId will be updated
                    // to reflect the latest subscription
                    await updateUserSubscriptionStatus({
                        supabase,
                        userId: user.id ?? "",
                        stripePriceId: (stripePriceId as StripePriceId) ?? "",
                        hasPremium: true,
                    });

                    if (status === FreeTrialStatus.ACTIVE) {
                        const { success, error } = await endUserFreeTrial({ supabase, userId: user.id });

                        if (error) {
                            console.error("Error ending free trial");
                        }

                        if (success) {
                            console.log("Free Trial has been ended");
                        }
                    }
                } else {
                    console.error("Error missing customer email or Stripe price Id");
                }

                try {
                    const plan = extractSubscriptionPlanDetails(stripePriceId as StripePriceId);

                    try {
                        // sends pre-order confirmation email for products not yet launched
                        axios.post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/sendPreOrderEmail`, {
                            userEmail: userEmail ?? "",
                            userFullName: session?.customer_details?.name ?? "",
                            purchasedPackage: plan?.name ?? "",
                        });

                        // sends official order confirmation email for live products
                        // axios.post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/sendOrderConfirmationEmail`, {
                        //     userEmail: userEmail ?? "",
                        //     userFullName: session?.customer_details?.name ?? "",
                        //     purchasedPackage: plan?.name ?? "",
                        // });
                    } catch (err) {
                        console.error("Failed to send pre-order email", err);
                    }
                } catch (error) {
                    console.error("Failed to send pre-order email:", error);
                }

                break;
            // checks if the user has cancelled their subscription
            // case "customer.subscription.deleted":
            //     const deletedSubscription = event.data.object as Stripe.Subscription;
            //     break;
            default:
                console.log(`Unhandled event: ${event.type}`);
        }

        return response.json({ received: true }, { status: 200 });
    } catch (err: any) {
        console.error("Error processing webhook:", err);
        return response.json({ error: "Webhook processing failed" }, { status: 500 });
    }
}
