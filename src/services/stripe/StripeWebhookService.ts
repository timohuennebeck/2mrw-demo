import { SubscriptionStatus } from "@/enums/SubscriptionStatus";
import moment from "moment";
import Stripe from "stripe";
import { isFreeTrialEnabled } from "@/config/paymentConfig";
import { FreeTrialStatus } from "@/enums/FreeTrialStatus";
import { endUserFreeTrial, fetchUserFreeTrial } from "@/services/database/FreeTrialService";
import { getClients } from "../database/BaseService";
import { fetchBillingPlan, fetchSubscriptionTier } from "../database/ProductService";
import {
    fetchUserSubscription,
    startUserSubscription,
    updateUserSubscription,
} from "../database/SubscriptionService";

export const handleSubscriptionUpdated = async (
    subscription: Stripe.Subscription,
    userId: string,
) => {
    if (!userId) throw new Error("No user ID provided");

    const { adminSupabase } = await getClients();
    const stripePriceId = subscription.items.data[0].price.id;

    try {
        // check if the subscription is set to cancel at the end of the current period
        if (subscription.cancel_at_period_end) {
            const { error: updateError } = await adminSupabase
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

            await adminSupabase.auth.admin.updateUserById(userId, {
                user_metadata: {
                    subscription_status: SubscriptionStatus.CANCELLED,
                    subscription_updated_at: moment().toISOString(),
                },
            });

            return { success: true };
        } else {
            const { subscriptionTier } = await fetchSubscriptionTier(stripePriceId);
            if (!subscriptionTier) throw new Error("SubscriptionTier not found");

            const { billingPlan } = await fetchBillingPlan(stripePriceId);
            if (!billingPlan) throw new Error("BillingPlan not found");

            // update subscription end date based on current period end
            const { error: updateError } = await adminSupabase
                .from("purchased_subscriptions")
                .update({
                    stripe_price_id: stripePriceId,
                    status: SubscriptionStatus.ACTIVE,
                    subscription_tier: subscriptionTier,
                    stripe_subscription_id: subscription.id,
                    billing_plan: billingPlan,
                    end_date: moment.unix(subscription.current_period_end).toISOString(),
                    updated_at: moment().toISOString(),
                })
                .eq("user_id", userId);

            if (updateError) {
                console.error("Error updating purchased_subscriptions:", updateError);
                throw updateError;
            }

            await adminSupabase.auth.admin.updateUserById(userId, {
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

const _handleFreeTrial = async (userId: string) => {
    if (!userId) throw new Error("User id is required!");

    const { freeTrial, error: fetchError } = await fetchUserFreeTrial(userId);
    if (fetchError) throw new Error("Failed to fetch user free trial!");

    if (freeTrial?.status === FreeTrialStatus.ACTIVE) {
        const { error } = await endUserFreeTrial(userId);
        if (error) throw new Error("Failed to end free trial!");
    }
};

const _getSubscriptionTierBillingPlan = async (stripePriceId: string) => {
    const { subscriptionTier } = await fetchSubscriptionTier(stripePriceId);
    const { billingPlan } = await fetchBillingPlan(stripePriceId);

    if (!subscriptionTier || !billingPlan) {
        const messageToShow = !subscriptionTier
            ? "SubscriptionTier not found!"
            : "BillingPlan not found!";

        throw new Error(messageToShow);
    }

    return { subscriptionTier, billingPlan };
};

export const handleCheckoutSessionCompleted = async (
    session: Stripe.Checkout.Session,
    userId: string,
) => {
    const { adminSupabase } = await getClients();

    const stripePriceId = session.line_items?.data[0].price?.id;
    if (!stripePriceId) throw new Error("Stripe price id is missing!");

    try {
        await _handleFreeTrial(userId);

        const { subscriptionTier, billingPlan } = await _getSubscriptionTierBillingPlan(stripePriceId);
        const { subscription } = await fetchUserSubscription(userId);

        const dataToUpdate = {
            userId,
            stripePriceId,
            subscriptionTier,
            stripeSubscriptionId: session.subscription?.toString(),
            billingPlan,
        };

        await (subscription
            ? updateUserSubscription(dataToUpdate)
            : startUserSubscription(dataToUpdate));

        await adminSupabase.auth.admin.updateUserById(userId, {
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
