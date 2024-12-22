import { FreeTrialStatus } from "@/enums";
import { handleError } from "@/utils/errors/error";
import moment from "moment";
import Stripe from "stripe";
import { getSubscriptionEndDate } from "../database/baseService";
import {
    cancelUserSubscription,
    updateUserSubscription,
} from "../database/subscriptionService";
import { getPricingPlan } from "../domain/pricingService";
import { createSupabasePowerUserClient } from "../integration/admin";

const _updateFreeTrialToConverted = async (userId: string) => {
    try {
        const adminSupabase = await createSupabasePowerUserClient();

        const { error: updateError } = await adminSupabase
            .from("free_trials")
            .update({
                status: FreeTrialStatus.CONVERTED,
                end_date: moment().toISOString(),
                updated_at: moment().toISOString(),
            })
            .eq("user_id", userId);

        if (updateError) return { success: false, error: updateError };

        return { success: true, error: null };
    } catch (error) {
        const unexpectedError = handleError(
            error,
            "_updateFreeTrialToConverted",
        );

        return { success: false, error: unexpectedError };
    }
};

export const handleCheckoutCompleted = async (
    session: Stripe.Checkout.Session,
    userId: string,
) => {
    const stripePriceId = session.line_items?.data[0].price?.id;
    if (!stripePriceId) {
        return { success: false, error: "Stripe price id is missing!" };
    }

    const isSubscription = session.mode === "subscription";
    const subscriptionId = isSubscription
        ? (session.subscription?.toString() ?? null)
        : null; // one-time payments don't have a subscription id

    const endDate = isSubscription
        ? await getSubscriptionEndDate(subscriptionId ?? "")
        : null;

    const pricingPlan = getPricingPlan(stripePriceId);
    if (!pricingPlan) {
        return { success: false, error: "Pricing plan is missing!" };
    }

    const { error: freeTrialError } = await _updateFreeTrialToConverted(userId);
    if (freeTrialError) return { success: false, error: freeTrialError };

    const { error: updateError } = await updateUserSubscription({
        userId,
        stripePriceId,
        stripeSubscriptionId: subscriptionId,
        subscriptionTier: pricingPlan.subscription_tier,
        billingPeriod: pricingPlan.billing_period,
        billingPlan: pricingPlan.billing_plan,
        endDate,
    });

    if (updateError) return { success: false, error: updateError };

    return { success: true, error: null };
};

export const handleCancelSubscription = async (
    userId: string,
    subscription: Stripe.Subscription,
) => {
    const endDate = subscription.current_period_end;
    const stripeEndDate = moment.unix(endDate).toISOString();

    const { error } = await cancelUserSubscription(userId, stripeEndDate);

    if (error) return { success: false, error };

    return { success: true, error: null };
};

export const handleUpdateSubscription = async (
    subscription: Stripe.Subscription,
    userId: string,
) => {
    const stripePriceId = subscription.items.data[0].price.id;
    if (!stripePriceId) {
        return { success: false, error: "Stripe price id is missing!" };
    }

    const plan = getPricingPlan(stripePriceId);
    if (!plan) return { success: false, error: "Pricing plan is missing!" };

    const { error } = await updateUserSubscription({
        userId,
        stripePriceId,
        stripeSubscriptionId: subscription.id,
        subscriptionTier: plan.subscription_tier,
        billingPeriod: plan.billing_period,
        billingPlan: plan.billing_plan,
        endDate: moment.unix(subscription.current_period_end).toISOString(),
    });

    if (error) return { success: false, error };

    return { success: true, error: null };
};
