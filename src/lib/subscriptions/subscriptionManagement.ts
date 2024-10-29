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
    fetchUser,
} from "@/services/supabase/queries";
import { FreeTrialStatus } from "@/enums/FreeTrialStatus";
import { SubscriptionStatus } from "@/enums/SubscriptionStatus";
import Stripe from "stripe";
import { sendPostPurchaseEmail } from "../email/emailServices";
import { UpsertUserSubscriptionParams } from "@/interfaces/SubscriptionInterfaces";
import { EndOnGoingUserFreeTrialParams } from "@/interfaces/FreeTrial";
import { createClient } from "@/services/supabase/server";
import moment from "moment";

export const endOnGoingUserFreeTrial = async ({
    status,
    userId,
}: EndOnGoingUserFreeTrialParams) => {
    if (status === FreeTrialStatus.ACTIVE) {
        const { error } = await endUserFreeTrial({ userId });

        if (error) throw new Error("Failed to end free trial");
    }
};

export async function upsertUserSubscription({
    userId,
    stripePriceId,
    subscriptionTier,
}: UpsertUserSubscriptionParams) {
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
}

export const handleCheckoutSessionCompleted = async ({
    session,
}: {
    session: Stripe.Checkout.Session;
}) => {
    const userId = session.metadata?.user_id;
    if (!userId) throw new Error("No user ID in session metadata");

    const supabase = createClient();

    const stripePriceId = session.line_items?.data[0].price?.id;

    try {
        // 1. Check and end any on-going free trials
        const { status } = await checkFreeTrialStatus({ userId });
        if (status) {
            await endOnGoingUserFreeTrial({ status, userId });
        }

        // 2. Fetch the subscription tier, so we can update the user subscription with it
        const { subscriptionTier } = await fetchSubscriptionTier({
            stripePriceId: stripePriceId ?? "",
        });

        if (!subscriptionTier) throw new Error("SubscriptionTier not found");

        // 3. Update the user subscription or create a new table and then update it
        await upsertUserSubscription({
            stripePriceId: stripePriceId ?? "",
            subscriptionTier,
            userId,
        });

        // 4. Update the user metadata
        await supabase.auth.updateUser({
            data: {
                subscription_status: SubscriptionStatus.ACTIVE,
                subscription_updated_at: new Date().toISOString(),
                free_trial_status: FreeTrialStatus.EXPIRED,
                free_trial_end_date: moment().toISOString(),
            },
        });

        // 5. Send confirmation email
        await sendPostPurchaseEmail({
            session,
            stripePriceId: stripePriceId ?? "",
        });

        return { success: true };
    } catch (error) {
        console.error("Error in handleCheckoutSessionCompleted:", error);
        throw error;
    }
};
