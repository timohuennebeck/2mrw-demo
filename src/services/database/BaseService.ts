"use server";

import Stripe from "stripe";
import { isOneTimePaymentEnabled } from "@/config/paymentConfig";
import moment from "moment";
import { createClient } from "../integration/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

export const checkRowExists = async (tableId: string, userId: string) => {
    const supabase = await createClient();

    try {
        const { error } = await supabase
            .from(tableId)
            .select("user_id")
            .eq("user_id", userId)
            .single();

        if (error) {
            if (error.code === "PGRST116") {
                return { rowExists: false, error: null };
            }
            return { rowExists: false, error };
        }

        return { rowExists: true, error: null };
    } catch (error) {
        return { rowExists: false, error };
    }
};

export const getEndDate = async (stripeSubscriptionId: string) => {
    if (isOneTimePaymentEnabled()) {
        return null;
    }

    if (!stripeSubscriptionId) {
        return null;
    }

    try {
        const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);
        return moment.unix(subscription.current_period_end).toISOString();
    } catch (error) {
        console.error("Error fetching subscription:", error);
        return null;
    }
};
