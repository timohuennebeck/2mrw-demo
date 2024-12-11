"use server";

import moment from "moment";
import { stripe } from "../stripe/client";

export const getSubscriptionEndDate = async (stripeSubscriptionId: string) => {
    try {
        const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);

        const isRecurring = subscription.items.data[0].price.recurring !== null;
        if (!isRecurring) return null;

        return moment.unix(subscription.current_period_end).toISOString();
    } catch (error) {
        console.error("Error fetching subscription:", error);
        return null;
    }
};
