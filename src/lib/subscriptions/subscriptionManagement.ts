"use server";

import { getCurrentPaymentSettings } from "@/config/paymentConfig";
import { FreeTrialStatus } from "@/enums/FreeTrialStatus";
import { SubscriptionStatus } from "@/enums/SubscriptionStatus";
import { UpsertUserSubscriptionParams } from "@/interfaces/SubscriptionInterfaces";
import {
    cancelUserSubscription,
    createPurchasedSubscriptionTable,
    endUserFreeTrial,
    endUserSubscription,
    updateUserPurchasedSubscription,
} from "@/services/supabase/admin";
import {
    checkFreeTrialStatus,
    checkUserRowExists,
    fetchSubscriptionTier,
} from "@/services/supabase/queries";
import { createClient } from "@/services/supabase/server";
import moment from "moment";
import Stripe from "stripe";

export const handleSubscriptionUpdated = async (subscription: Stripe.Subscription) => {
    const userId = subscription.metadata.user_id;
    if (!userId) throw new Error("No user ID in subscription metadata");

    const supabase = createClient();
    const stripePriceId = subscription.items.data[0].price.id;

    try {
        const { subscriptionTier } = await fetchSubscriptionTier(stripePriceId);
        if (!subscriptionTier) throw new Error("SubscriptionTier not found");

        // update subscription end date based on current period end
        await supabase
            .from("purchased_subscriptions")
            .update({
                end_date: moment.unix(subscription.current_period_end).toISOString(),
                status: SubscriptionStatus.ACTIVE,
                updated_at: moment().toISOString(),
            })
            .eq("user_id", userId);

        await supabase.auth.updateUser({
            data: {
                subscription_status: SubscriptionStatus.ACTIVE,
                subscription_updated_at: moment().toISOString(),
                free_trial_status: FreeTrialStatus.EXPIRED,
                free_trial_end_date: moment().toISOString(),
            },
        });

        return { success: true };
    } catch (error) {
        console.error("Error in handleSubscriptionUpdated:", error);
        throw error;
    }
};

export const handleSubscriptionDeleted = async (subscription: Stripe.Subscription) => {
    const userId = subscription.metadata.user_id;
    if (!userId) throw new Error("No user ID in subscription metadata");

    const supabase = createClient();

    try {
        const { error } = await cancelUserSubscription(userId);
        if (error) throw error;

        return { success: true };
    } catch (error) {
        console.error("Error in handleSubscriptionDeleted:", error);
        throw error;
    }
};

const upsertUserSubscription = async ({
    userId,
    stripePriceId,
    subscriptionTier,
}: UpsertUserSubscriptionParams) => {
    const { rowExists } = await checkUserRowExists({ tableId: "purchased_subscriptions", userId });

    if (rowExists) {
        await updateUserPurchasedSubscription({
            userId,
            stripePriceId,
            status: SubscriptionStatus.ACTIVE,
            subscriptionTier,
        });
    } else {
        await createPurchasedSubscriptionTable({
            userId,
            stripePriceId,
            subscriptionTier,
        });
    }
};

const endOnGoingFreeTrial = async (userId: string) => {
    const { status } = await checkFreeTrialStatus({ userId });

    if (status === FreeTrialStatus.ACTIVE) {
        const { error } = await endUserFreeTrial({ userId });
        if (error) throw new Error("Failed to end free trial");
    }
};

export const handleCheckoutSessionCompleted = async (session: Stripe.Checkout.Session) => {
    const userId = session.metadata?.user_id;
    if (!userId) throw new Error("No user ID in session metadata");

    const stripePriceId = session.line_items?.data[0].price?.id;
    if (!stripePriceId) throw new Error("No stripe price ID found in session");

    const supabase = createClient();

    try {
        const { enableFreeTrial } = getCurrentPaymentSettings();
        if (enableFreeTrial) await endOnGoingFreeTrial(userId); // if free trial is not enabled, we don't need to check for an on-going free trial

        const { subscriptionTier } = await fetchSubscriptionTier(stripePriceId);
        if (!subscriptionTier) throw new Error("SubscriptionTier not found");

        // updates the user subscription or creates a new table and then updates it
        await upsertUserSubscription({ stripePriceId, subscriptionTier, userId });

        await supabase.auth.updateUser({
            data: {
                subscription_status: SubscriptionStatus.ACTIVE,
                subscription_updated_at: new Date().toISOString(),
                free_trial_status: FreeTrialStatus.EXPIRED,
                free_trial_end_date: moment().toISOString(),
            },
        });

        return { success: true };
    } catch (error) {
        console.error("Error in handleCheckoutSessionCompleted:", error);
        throw error;
    }
};
