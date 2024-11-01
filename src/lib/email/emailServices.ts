"use server";

import axios from "axios";
import { fetchProducts } from "@/services/supabase/queries";
import { Product } from "@/interfaces/ProductInterfaces";
import { SendPostPurchaseEmailParams } from "@/interfaces/EmailInterfaces";
import { isOneTimePaymentEnabled } from "@/config/paymentConfig";
import { emailConfig } from "@/config/emailConfig";
import { TextConstants } from "@/constants/TextConstants";
import { Resend } from "resend";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_EMAIL_API_KEY ?? "");

export const sendPostPurchaseEmail = async ({
    session,
    stripePriceId,
}: SendPostPurchaseEmailParams) => {
    try {
        const { products, error } = await fetchProducts();
        if (error) throw new Error("Failed to fetch products");

        const plan = products?.find((plan: Product) => {
            if (isOneTimePaymentEnabled()) {
                return plan.pricing.one_time?.stripe_price_id === stripePriceId;
            }
            return (
                plan.pricing.subscription?.monthly?.stripe_price_id === stripePriceId ||
                plan.pricing.subscription?.yearly?.stripe_price_id === stripePriceId
            );
        });
        if (!plan) throw new Error("Plan not found");

        if (!emailConfig.settings.postPurchaseEmail.isEnabled) {
            console.log("Post purchase email is disabled");
            return;
        }

        // sends official order confirmation email for live products
        await axios.post("/api/email-services/send-purchased-paid-plan-email", {
            userEmail: session.customer_details?.email ?? "",
            userFirstName: session?.customer_details?.name ?? "",
            purchasedPackage: plan?.name ?? "",
        });
    } catch (error) {
        throw new Error("Failed to send order confirmation email");
    }
};
