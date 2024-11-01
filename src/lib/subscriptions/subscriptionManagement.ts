"use server";

import {
    endUserFreeTrial,
    updateUserPurchasedSubscription,
    createPurchasedSubscriptionTable,
} from "@/services/supabase/admin";
import {
    checkFreeTrialStatus,
    checkUserRowExists,
    fetchSubscriptionTier,
} from "@/services/supabase/queries";
import { FreeTrialStatus } from "@/enums/FreeTrialStatus";
import { SubscriptionStatus } from "@/enums/SubscriptionStatus";
import Stripe from "stripe";
import { sendPostPurchaseEmail } from "../email/emailServices";
import { UpsertUserSubscriptionParams } from "@/interfaces/SubscriptionInterfaces";
import { createClient } from "@/services/supabase/server";
import moment from "moment";
import { getCurrentPaymentSettings } from "@/config/paymentConfig";

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

export const handleOneTimePayment = async ({ session }: { session: Stripe.Checkout.Session }) => {
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
        console.error("Error in handleOneTimePayment:", error);
        throw error;
    }
};
