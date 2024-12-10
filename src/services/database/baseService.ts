"use server";


import moment from "moment";
import { createClient } from "../integration/server";
import { stripe } from "../stripe/client";
import { isOneTimePaymentEnabled } from "@/config";

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
    if (isOneTimePaymentEnabled() || !stripeSubscriptionId) {
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
