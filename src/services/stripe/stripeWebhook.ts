import { defaultPricingPlans } from "@/data/marketing/pricing-data";
import { BillingPlan, SubscriptionStatus } from "@/enums";
import moment from "moment";
import Stripe from "stripe";
import { getSubscriptionEndDate } from "../database/baseService";
import {
    cancelUserSubscription,
    fetchUserSubscription,
    startUserSubscription,
    updateUserSubscription,
} from "../database/subscriptionService";
import { createSupabasePowerUserClient } from "../integration/admin";
import { getBillingPlan, getSubscriptionTier } from "../domain/subscriptionService";

export const handleCheckoutSessionCompleted = async (
    session: Stripe.Checkout.Session,
    userId: string,
) => {
    const adminSupabase = await createSupabasePowerUserClient();

    const stripePriceId = session.line_items?.data[0].price?.id;
    if (!stripePriceId) throw new Error("Stripe price id is missing!");

    // one-time payments don't have a subscription id
    const stripeSubscriptionId =
        session.mode === "subscription" ? session.subscription?.toString() : null;

    try {
        const { data: subscription } = await fetchUserSubscription(userId);

        // for one-time payments, end_date will be null
        const endDate = await getSubscriptionEndDate(stripeSubscriptionId ?? "");

        const { subscriptionTier } = getSubscriptionTier(stripePriceId);
        const { billingPlan } = getBillingPlan(stripePriceId);

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
            },
        });

        return { success: true };
    } catch (error) {
        console.error("Error in handleCheckoutSessionCompleted:", error);
        throw error;
    }
};

export const handleCancelSubscription = async (
    userId: string,
    subscription: Stripe.Subscription,
) => {
    const endDateFromStripe = moment.unix(subscription.current_period_end).toISOString();
    const { error: cancelError } = await cancelUserSubscription(userId, endDateFromStripe);

    if (cancelError) throw cancelError;
};

export const handleUpdateSubscription = async (
    subscription: Stripe.Subscription,
    userId: string,
) => {
    const stripePriceId = subscription.items.data[0].price.id;
    if (!stripePriceId) throw new Error("Stripe price id is missing!");

    try {
        const { subscriptionTier } = getSubscriptionTier(stripePriceId);
        const { billingPlan } = getBillingPlan(stripePriceId);

        await updateUserSubscription({
            userId,
            stripePriceId,
            subscriptionTier,
            stripeSubscriptionId: subscription.id,
            endDate: moment.unix(subscription.current_period_end).toISOString(),
            billingPlan,
        });
    } catch (error) {
        console.error("Error in handleUpdateSubscription:", error);
        throw error;
    }
};
