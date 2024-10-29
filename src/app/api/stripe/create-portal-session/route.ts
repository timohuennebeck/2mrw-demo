import { NextResponse as response } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
    try {
        const { customerId } = await request.json();

        const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/billing`,
        });

        return response.json({ url: session.url });
    } catch (error) {
        return response.json({ error: "Failed to create Stripe portal session" }, { status: 500 });
    }
}
