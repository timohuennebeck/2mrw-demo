"use server";

import {
    endUserFreeTrial,
    updateUserPurchasedSubscription,
    createPurchasedSubscriptionTable,
} from "@/services/supabase/admin";
import {
    checkFreeTrialStatus,
    checkUserProductPreorderStatus,
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

export const endOnGoingUserFreeTrial = async ({
    status,
    userId,
}: EndOnGoingUserFreeTrialParams) => {
    if (status === FreeTrialStatus.ACTIVE) {
        const { error } = await endUserFreeTrial({ userId });

        if (error) throw new Error("Failed to end free trial");

        console.log("Free Trial has been ended");
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
    const supabase = createClient();

    const userEmail = session?.customer_details?.email;
    const stripePriceId = session.line_items?.data[0].price?.id;

    if (userEmail && stripePriceId) {
        const { user } = await fetchUser({ userEmail });
        if (!user) throw new Error("User not found");

        const { status } = await checkFreeTrialStatus({ userId: user.user_id });

        if (status) {
            await endOnGoingUserFreeTrial({ status: status, userId: user.user_id });
        }

        const { subscriptionTier } = await fetchSubscriptionTier({ stripePriceId });
        if (!subscriptionTier) throw new Error("SubscriptionTier not found");

        await upsertUserSubscription({ stripePriceId, subscriptionTier, userId: user.user_id });

        await supabase.auth.updateUser({
            data: {
                subscriptionStatus: SubscriptionStatus.ACTIVE,
                freeTrialStatus: FreeTrialStatus.EXPIRED,
                lastStatusCheck: new Date(),
            },
        });

        const { isPreorder } = await checkUserProductPreorderStatus({ userId: user.user_id });

        await sendPostPurchaseEmail({
            session,
            stripePriceId: stripePriceId ?? "",
            isPreOrder: isPreorder ?? false,
        });
    }
};
