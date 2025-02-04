"use server";

import { billingConfig } from "@/config";
import { FreeTrialStatus, SubscriptionStatus } from "@/enums";
import { handleError } from "@/utils/errors/error";
import moment from "moment";
import { getPricingPlan } from "../domain/pricing-service";
import { createClient } from "../supabase-clients/server";
import { stripe } from "../stripe/client";
import { getStripeCustomerId } from "../stripe/stripe-customer";
import { updateUserSubscription } from "./subscription-service";

export const fetchUserFreeTrial = async (userId: string) => {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("free_trials")
            .select("*")
            .eq("user_id", userId)
            .single();

        if (error) throw error;

        return { data, error: null };
    } catch (error) {
        return {
            data: null,
            error: handleError(error, "fetchUserFreeTrial"),
        };
    }
};

// TODO: make smaller
export const startFreeTrial = async (userId: string, stripePriceId: string) => {
    const supabase = await createClient();

    const { stripeCustomerId } = await getStripeCustomerId();

    try {
        const stripeSubscription = await stripe.subscriptions.create({
            customer: stripeCustomerId,
            items: [{ price: stripePriceId }],
            trial_period_days: billingConfig.freeTrial.duration,
            payment_behavior: "default_incomplete",
            trial_settings: {
                end_behavior: {
                    missing_payment_method: "cancel",
                },
            },
        });

        const plan = getPricingPlan(stripePriceId);
        if (!plan) throw new Error("Pricing plan is missing!");

        const { data: existingSubscription } = await supabase
            .from("subscriptions")
            .select("*")
            .eq("user_id", userId)
            .single();

        if (!existingSubscription) {
            const { error: insertError } = await supabase
                .from("subscriptions")
                .insert({
                    user_id: userId,
                    stripe_price_id: stripePriceId,
                    stripe_subscription_id: stripeSubscription.id,
                    status: SubscriptionStatus.TRIALING,
                    subscription_tier: plan.subscription_tier,
                    billing_period: plan.billing_period,
                    billing_plan: plan.billing_plan,
                    end_date: moment.unix(stripeSubscription.current_period_end)
                        .toISOString(),
                    created_at: moment().toISOString(),
                    updated_at: moment().toISOString(),
                });

            if (insertError) throw insertError;
        } else {
            await updateUserSubscription({
                userId,
                stripePriceId,
                stripeSubscriptionId: stripeSubscription.id,
                status: SubscriptionStatus.TRIALING,
                subscriptionTier: plan.subscription_tier,
                billingPeriod: plan.billing_period,
                billingPlan: plan.billing_plan,
                endDate: moment.unix(stripeSubscription.current_period_end)
                    .toISOString(),
            });
        }

        const freeTrialEndDate = moment.unix(stripeSubscription.trial_end ?? 0)
            .toISOString();

        const { error } = await supabase.from("free_trials")
            .insert({
                user_id: userId,
                subscription_tier: plan.subscription_tier,
                stripe_subscription_id: stripeSubscription.id,
                status: FreeTrialStatus.ACTIVE,
                start_date: moment().toISOString(),
                end_date: freeTrialEndDate,
                created_at: moment().toISOString(),
                updated_at: moment().toISOString(),
            });

        if (error) {
            return {
                success: false,
                freeTrialEndDate: null,
                error: error,
            };
        }

        return {
            success: true,
            freeTrialEndDate: moment(freeTrialEndDate).format(
                "Do [of] MMMM, YYYY",
            ),
            error: null,
        };
    } catch (error) {
        return {
            success: false,
            freeTrialEndDate: null,
            error: handleError(error, "startFreeTrial"),
        };
    }
};
