"use server";

import { getCurrentPaymentSettings } from "@/config/paymentConfig";
import { FreeTrialStatus } from "@/enums/FreeTrialStatus";
import { SubscriptionStatus } from "@/enums/SubscriptionStatus";
import { UpsertUserSubscriptionParams } from "@/interfaces/SubscriptionInterfaces";
import {
    cancelUserSubscription,
    startUserSubscription,
    endUserFreeTrial,
    updateUserSubscription,
    getSupabasePowerUser,
} from "@/services/supabase/admin";
import {
    checkUserRowExists,
    fetchSubscriptionTier,
    fetchUserFreeTrial,
} from "@/services/supabase/queries";
import moment from "moment";
import Stripe from "stripe";

export const handleSubscriptionUpdated = async ({
    subscription,
    userId,
}: {
    subscription: Stripe.Subscription;
    userId: string;
}) => {
    if (!userId) throw new Error("No user ID provided");

    const supabase = getSupabasePowerUser();
    const stripePriceId = subscription.items.data[0].price.id;

    try {
        const { subscriptionTier } = await fetchSubscriptionTier(stripePriceId);
        if (!subscriptionTier) throw new Error("SubscriptionTier not found");

        // check if the subscription is set to cancel at the end of the current period
        if (subscription.cancel_at_period_end) {
            const { error: updateError } = await supabase
                .from("purchased_subscriptions")
                .update({
                    status: SubscriptionStatus.CANCELLED,
                    end_date: moment.unix(subscription.current_period_end).toISOString(),
                    updated_at: moment().toISOString(),
                })
                .eq("user_id", userId);

            if (updateError) {
                console.error("Error updating purchased_subscriptions:", updateError);
                throw updateError;
            }

            const { error: authUserUpdateError } = await supabase.auth.admin.updateUserById(
                userId,
                {
                    user_metadata: {
                        subscription_status: SubscriptionStatus.CANCELLED,
                        subscription_updated_at: moment().toISOString(),
                    },
                },
            );

            if (authUserUpdateError) {
                console.error("Error updating auth user:", authUserUpdateError);
                throw authUserUpdateError;
            }
        } else {
            // update subscription end date based on current period end
            await supabase
                .from("purchased_subscriptions")
                .update({
                    end_date: moment.unix(subscription.current_period_end).toISOString(),
                    status: SubscriptionStatus.ACTIVE,
                    updated_at: moment().toISOString(),
                })
                .eq("user_id", userId);

            await supabase.auth.admin.updateUserById(userId, {
                user_metadata: {
                    subscription_status: SubscriptionStatus.ACTIVE,
                    subscription_updated_at: moment().toISOString(),
                },
            });
        }

        return { success: true };
    } catch (error) {
        console.error("Error in handleSubscriptionUpdated:", error);
        throw error;
    }
};

export const handleSubscriptionDeleted = async (userId: string) => {
    if (!userId) throw new Error("No user ID provided");

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
        await updateUserSubscription({
            userId,
            stripePriceId,
            status: SubscriptionStatus.ACTIVE,
            subscriptionTier,
        });
    } else {
        await startUserSubscription({
            userId,
            stripePriceId,
            subscriptionTier,
        });
    }
};

const endOnGoingFreeTrial = async (userId: string) => {
    const { freeTrial } = await fetchUserFreeTrial(userId);

    if (freeTrial?.status === FreeTrialStatus.ACTIVE) {
        const { error } = await endUserFreeTrial({ userId });
        if (error) throw new Error("Failed to end free trial");
    }
};

export const handleCheckoutSessionCompleted = async ({
    session,
    userId,
}: {
    session: Stripe.Checkout.Session;
    userId: string;
}) => {
    if (!userId) throw new Error("No user ID provided");

    const stripePriceId = session.line_items?.data[0].price?.id;
    if (!stripePriceId) throw new Error("No stripe price ID found in session");

    const supabase = getSupabasePowerUser();

    try {
        const { enableFreeTrial } = getCurrentPaymentSettings();
        if (enableFreeTrial) await endOnGoingFreeTrial(userId); // if free trial is not enabled, we don't need to check for an on-going free trial

        const { subscriptionTier } = await fetchSubscriptionTier(stripePriceId);
        if (!subscriptionTier) throw new Error("SubscriptionTier not found");

        // updates the user subscription or creates a new table and then updates it
        await upsertUserSubscription({ stripePriceId, subscriptionTier, userId });

        await supabase.auth.admin.updateUserById(userId, {
            user_metadata: {
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
