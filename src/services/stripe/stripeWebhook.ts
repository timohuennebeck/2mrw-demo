import { FreeTrialStatus, SubscriptionStatus } from "@/enums";
import { handleSupabaseError } from "@/utils/errors/supabaseError";
import moment from "moment";
import Stripe from "stripe";
import { getSubscriptionEndDate } from "../database/baseService";
import {
    cancelUserSubscription,
    updateUserSubscription,
} from "../database/subscriptionService";
import { createSupabasePowerUserClient } from "../integration/admin";
import { getPricingPlan } from "../domain/pricingService";

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
        const supabaseError = handleSupabaseError(
            error,
            "_updateFreeTrialToConverted",
        );
        return { success: false, error: supabaseError };
    }
};

export const handleCheckoutCompleted = async (
    session: Stripe.Checkout.Session,
    userId: string,
) => {
    const stripePriceId = session.line_items?.data[0].price?.id;
    if (!stripePriceId) throw new Error("Stripe price id is missing!");

    const isSubscription = session.mode === "subscription";
    const subscriptionId = isSubscription
        ? (session.subscription?.toString() ?? null)
        : null; // one-time payments don't have a subscription id

    const endDate = isSubscription
        ? await getSubscriptionEndDate(subscriptionId ?? "")
        : null;

    const pricingPlan = getPricingPlan(stripePriceId);
    if (!pricingPlan) throw new Error("Pricing plan is missing!");

    const { error: freeTrialError } = await _updateFreeTrialToConverted(userId);
    if (freeTrialError) throw freeTrialError;

    await updateUserSubscription({
        userId,
        stripePriceId,
        stripeSubscriptionId: subscriptionId,
        subscriptionTier: pricingPlan.subscription_tier,
        billingPeriod: pricingPlan.billing_period,
        billingPlan: pricingPlan.billing_plan,
        endDate,
    });
};

export const handleCancelSubscription = async (
    userId: string,
    subscription: Stripe.Subscription,
) => {
    const stripeEndDate = moment.unix(subscription.current_period_end)
        .toISOString();
    await cancelUserSubscription(userId, stripeEndDate);
};

export const handleUpdateSubscription = async (
    subscription: Stripe.Subscription,
    userId: string,
) => {
    const stripePriceId = subscription.items.data[0].price.id;
    if (!stripePriceId) throw new Error("Stripe price id is missing!");

    const plan = getPricingPlan(stripePriceId);
    if (!plan) throw new Error("Pricing plan is missing!");

    await updateUserSubscription({
        userId,
        stripePriceId,
        stripeSubscriptionId: subscription.id,
        subscriptionTier: plan.subscription_tier,
        billingPeriod: plan.billing_period,
        billingPlan: plan.billing_plan,
        endDate: moment.unix(subscription.current_period_end).toISOString(),
    });
};
