"use server";

import { getCurrentPaymentSettings } from "@/config/paymentConfig";
import { FreeTrialStatus } from "@/enums/FreeTrialStatus";
import { SubscriptionStatus } from "@/enums/SubscriptionStatus";
import { PricingModel } from "@/interfaces/StripePrices";
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
    fetchPricingModel,
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

    const supabasePowerUser = await getSupabasePowerUser();
    const stripePriceId = subscription.items.data[0].price.id;

    try {
        // check if the subscription is set to cancel at the end of the current period
        if (subscription.cancel_at_period_end) {
            const { error: updateError } = await supabasePowerUser
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

            await supabasePowerUser.auth.admin.updateUserById(userId, {
                user_metadata: {
                    subscription_status: SubscriptionStatus.CANCELLED,
                    subscription_updated_at: moment().toISOString(),
                },
            });

            return { success: true };
        } else {
            const { subscriptionTier } = await fetchSubscriptionTier(stripePriceId);
            if (!subscriptionTier) throw new Error("SubscriptionTier not found");

            const { pricingModel } = await fetchPricingModel(stripePriceId);
            if (!pricingModel) throw new Error("PricingModel not found");

            // update subscription end date based on current period end
            const { error: updateError } = await supabasePowerUser
                .from("purchased_subscriptions")
                .update({
                    stripe_price_id: stripePriceId,
                    status: SubscriptionStatus.ACTIVE,
                    subscription_tier: subscriptionTier,
                    stripe_subscription_id: subscription.id,
                    pricing_model: pricingModel,
                    end_date: moment.unix(subscription.current_period_end).toISOString(),
                    updated_at: moment().toISOString(),
                })
                .eq("user_id", userId);

            if (updateError) {
                console.error("Error updating purchased_subscriptions:", updateError);
                throw updateError;
            }

            await supabasePowerUser.auth.admin.updateUserById(userId, {
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
    stripeSubscriptionId,
}: UpsertUserSubscriptionParams) => {
    const { rowExists } = await checkUserRowExists({ tableId: "purchased_subscriptions", userId });

    if (rowExists) {
        await updateUserSubscription({
            userId,
            stripePriceId,
            status: SubscriptionStatus.ACTIVE,
            subscriptionTier,
            stripeSubscriptionId,
        });
    } else {
        await startUserSubscription({
            userId,
            stripePriceId,
            subscriptionTier,
            stripeSubscriptionId,
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

    const supabasePowerUser = await getSupabasePowerUser();

    try {
        const { enableFreeTrial } = getCurrentPaymentSettings();
        if (enableFreeTrial) await endOnGoingFreeTrial(userId); // if free trial is not enabled in the paymentConfig.ts, we don't need to check for an on-going free trial

        const { subscriptionTier } = await fetchSubscriptionTier(stripePriceId);
        if (!subscriptionTier) throw new Error("SubscriptionTier not found");

        // updates the user subscription or creates a new table and then updates it
        await upsertUserSubscription({
            stripePriceId,
            subscriptionTier,
            userId,
            stripeSubscriptionId: session.subscription?.toString(),
        });

        await supabasePowerUser.auth.admin.updateUserById(userId, {
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
