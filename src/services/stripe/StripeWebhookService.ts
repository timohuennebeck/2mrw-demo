import { SubscriptionStatus } from "@/enums/SubscriptionStatus";
import moment from "moment";
import Stripe from "stripe";
import { isFreeTrialEnabled } from "@/config/paymentConfig";
import { FreeTrialStatus } from "@/enums/FreeTrialStatus";
import { endUserFreeTrial, fetchUserFreeTrial } from "@/services/database/FreeTrialService";
import { getClients } from "../database/BaseService";
import { fetchPricingModel, fetchSubscriptionTier } from "../database/ProductService";
import {
    fetchUserSubscription,
    startUserSubscription,
    updateUserSubscription,
} from "../database/SubscriptionService";

export const endOnGoingFreeTrial = async (userId: string) => {
    const { freeTrial } = await fetchUserFreeTrial(userId);

    if (freeTrial?.status === FreeTrialStatus.ACTIVE) {
        const { error } = await endUserFreeTrial(userId);
        if (error) throw new Error("Failed to end free trial");
    }
};

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

            const { pricingModel } = await fetchPricingModel(stripePriceId);
            if (!pricingModel) throw new Error("PricingModel not found");

            // update subscription end date based on current period end
            const { error: updateError } = await adminSupabase
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

export const handleCheckoutSessionCompleted = async (
    session: Stripe.Checkout.Session,
    userId: string,
) => {
    if (!userId) throw new Error("No user ID provided");

    const stripePriceId = session.line_items?.data[0].price?.id;
    if (!stripePriceId) throw new Error("No stripe price ID found in session");

    const { adminSupabase } = await getClients();

    try {
        if (isFreeTrialEnabled()) {
            await endOnGoingFreeTrial(userId);
        }

        const { subscriptionTier } = await fetchSubscriptionTier(stripePriceId);
        if (!subscriptionTier) throw new Error("SubscriptionTier not found");

        const { pricingModel } = await fetchPricingModel(stripePriceId);
        if (!pricingModel) throw new Error("PricingModel not found");

        const { subscription } = await fetchUserSubscription(userId);

        if (subscription) {
            await updateUserSubscription({
                userId,
                stripePriceId,
                status: SubscriptionStatus.ACTIVE,
                subscriptionTier,
                stripeSubscriptionId: session.subscription?.toString(),
                pricingModel,
            });
        } else {
            await startUserSubscription({
                userId,
                stripePriceId,
                subscriptionTier,
                stripeSubscriptionId: session.subscription?.toString(),
                pricingModel,
            });
        }

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
