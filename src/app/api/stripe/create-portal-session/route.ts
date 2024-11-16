import { stripe } from "@/services/stripe/client";
import { NextResponse as response } from "next/server";

export async function POST(request: Request) {
    try {
        const { stripeCustomerId } = await request.json();

        const session = await stripe.billingPortal.sessions.create({
            customer: stripeCustomerId,
            return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/billing`,
        });

        return response.json({ url: session.url });
    } catch (error) {
        return response.json({ error: "Failed to create Stripe portal session" }, { status: 500 });
    }
}
