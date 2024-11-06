import { SubscriptionStatus } from "@/enums/SubscriptionStatus";
import moment from "moment";
import Stripe from "stripe";
import { FreeTrialStatus } from "@/enums/FreeTrialStatus";
import { endUserFreeTrial, fetchUserFreeTrial } from "@/services/database/FreeTrialService";
import { getEndDate } from "../database/BaseService";
import { fetchBillingPlan, fetchSubscriptionTier } from "../database/ProductService";
import {
    cancelUserSubscription,
    fetchUserSubscription,
    startUserSubscription,
    updateUserSubscription,
} from "../database/SubscriptionService";
import { createSupabasePowerUserClient } from "../integration/admin";

const _handleFreeTrial = async (userId: string) => {
    if (!userId) throw new Error("User id is required!");

    const { freeTrial, error: fetchError } = await fetchUserFreeTrial(userId);
    if (fetchError) throw new Error("Failed to fetch user free trial!");

    if (freeTrial?.status === FreeTrialStatus.ACTIVE) {
        const { error } = await endUserFreeTrial(userId);
        if (error) throw new Error("Failed to end free trial!");
    }
};

const _handleSubscriptionCancellation = async (
    userId: string,
    subscription: Stripe.Subscription,
) => {
    const endDateFromStripe = moment.unix(subscription.current_period_end).toISOString();
    const { error: cancelError } = await cancelUserSubscription(userId, endDateFromStripe);

    if (cancelError) throw cancelError;
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
    const adminSupabase = await createSupabasePowerUserClient();

    const stripePriceId = session.line_items?.data[0].price?.id;
    if (!stripePriceId) throw new Error("Stripe price id is missing!");

    const stripeSubscriptionId = session.subscription?.toString();
    if (!stripeSubscriptionId) throw new Error("Stripe subscription id is missing!");

    try {
        await _handleFreeTrial(userId);

        const { subscriptionTier, billingPlan } =
            await _getSubscriptionTierBillingPlan(stripePriceId);
        const { subscription } = await fetchUserSubscription(userId);

        const endDate = await getEndDate(stripeSubscriptionId ?? "");
        if (!endDate) throw new Error("End date is missing!");

        const dataToUpdate = {
            userId,
            stripePriceId,
            subscriptionTier,
            stripeSubscriptionId,
            endDate,
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

export const handleSubscriptionUpdated = async (
    subscription: Stripe.Subscription,
    userId: string,
) => {
    if (!userId) throw new Error("User id is required!");

    const stripePriceId = subscription.items.data[0].price.id;
    if (!stripePriceId) throw new Error("Stripe price id is missing!");

    try {
        if (subscription.cancel_at_period_end) {
            await _handleSubscriptionCancellation(userId, subscription); // check if the subscription is set to cancel at the end of the current period
        }

        const { subscriptionTier, billingPlan } =
            await _getSubscriptionTierBillingPlan(stripePriceId);

        await updateUserSubscription({
            userId,
            stripePriceId,
            subscriptionTier,
            stripeSubscriptionId: subscription.id,
            endDate: moment.unix(subscription.current_period_end).toISOString(),
            billingPlan,
        });

        return { success: true };
    } catch (error) {
        console.error("Error in handleSubscriptionUpdated:", error);
        throw error;
    }
};
