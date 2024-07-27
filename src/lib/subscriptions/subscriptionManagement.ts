import {
    endUserFreeTrial,
    updateUserPurchasedSubscription,
    createPurchasedSubscriptionTable,
} from "@/lib/supabase/admin";
import {
    checkFreeTrialStatus,
    checkTableExists,
    fetchSubscriptionTier,
    fetchUser,
} from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/client";
import { FreeTrialStatus } from "@/enums/FreeTrialStatus";
import { SubscriptionStatus } from "@/enums/SubscriptionStatus";
import Stripe from "stripe";
import { sendPostPurchaseEmail } from "../email/emailServices";
import { UpsertUserSubscriptionParams } from "@/interfaces/SubscriptionInterfaces";
import { EndOnGoingUserFreeTrialParams } from "@/interfaces/FreeTrial";

const supabase = createClient();

export const endOnGoingUserFreeTrial = async ({
    status,
    userId,
}: EndOnGoingUserFreeTrialParams) => {
    if (status === FreeTrialStatus.ACTIVE) {
        const { error } = await endUserFreeTrial({
            supabase,
            userId,
        });

        if (error) throw new Error("Failed to end free trial");

        console.log("Free Trial has been ended");
    }
};

export async function upsertUserSubscription({
    userId,
    stripePriceId,
    subscriptionTier,
}: UpsertUserSubscriptionParams) {
    const { tableExists } = await checkTableExists({ tableId: "purchased_subscriptions" });

    if (tableExists) {
        await updateUserPurchasedSubscription({
            supabase,
            userId,
            stripePriceId,
            status: SubscriptionStatus.ACTIVE,
            subscriptionTier,
        });
    } else {
        await createPurchasedSubscriptionTable({
            supabase,
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
    const userEmail = session?.customer_details?.email;
    const stripePriceId = session.line_items?.data[0].price?.id;

    if (userEmail && stripePriceId) {
        const { user } = await fetchUser({ userEmail });
        if (!user) throw new Error("User not found");

        const { status } = await checkFreeTrialStatus({ userId: user.user_id });
        if (!status) throw new Error("Free Trial status not found");

        await endOnGoingUserFreeTrial({ status: status, userId: user.user_id });

        const { subscriptionTier } = await fetchSubscriptionTier({ stripePriceId });
        if (!subscriptionTier) throw new Error("SubscriptionTier not found");

        await upsertUserSubscription({ stripePriceId, subscriptionTier, userId: user.user_id });

        await sendPostPurchaseEmail({
            session,
            stripePriceId: stripePriceId ?? "",
            isPreOrder: true,
        });
    }
};
