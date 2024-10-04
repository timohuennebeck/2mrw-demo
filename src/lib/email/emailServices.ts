"use server";

import axios from "axios";
import { fetchProducts } from "@/services/supabase/queries";
import { Product } from "@/interfaces/ProductInterfaces";
import { SendPostPurchaseEmailParams } from "@/interfaces/EmailInterfaces";

export const sendPostPurchaseEmail = async ({
    session,
    stripePriceId,
}: SendPostPurchaseEmailParams) => {
    try {
        const { products, error } = await fetchProducts();
        if (error) throw new Error("Failed to fetch products");

        const plan = products?.find((plan: Product) => plan.stripe_price_id === stripePriceId);
        if (!plan) throw new Error("Plan not found");

        const postUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/email-services/send-order-confirmation-email`;

        // sends official order confirmation email for live products
        await axios.post(postUrl, {
            userEmail: session.customer_details?.email ?? "",
            userFullName: session?.customer_details?.name ?? "",
            purchasedPackage: plan?.name ?? "",
        });
    } catch (error) {
        throw new Error("Failed to send order confirmation email");
    }
};
