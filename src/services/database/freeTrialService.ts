"use server";

import { billingConfig } from "@/config";
import { FreeTrialStatus, SubscriptionStatus } from "@/enums";
import { handleSupabaseError } from "@/utils/errors/supabaseError";
import moment from "moment";
import {
    getBillingPeriod,
    getBillingPlan,
    getSubscriptionTier,
} from "../domain/subscriptionService";
import { createClient } from "../integration/server";
import { stripe } from "../stripe/client";
import { getStripeCustomerId } from "../stripe/stripeCustomer";

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
            error: handleSupabaseError(error, "fetchUserFreeTrial"),
        };
    }
};

export const startFreeTrial = async (userId: string, stripePriceId: string) => {
    const supabase = await createClient();

    const { stripeCustomerId } = await getStripeCustomerId();

    try {
        // create Stripe subscription with trial
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

        // create subscription record
        const { error: subscriptionError } = await supabase.from("user_subscriptions").insert({
            user_id: userId,
            stripe_price_id: stripePriceId,
            stripe_subscription_id: stripeSubscription.id,
            status: SubscriptionStatus.TRIALING,
            subscription_tier: getSubscriptionTier(stripePriceId).subscriptionTier,
            billing_period: getBillingPeriod(stripePriceId).billingPeriod,
            billing_plan: getBillingPlan(stripePriceId).billingPlan,
            end_date: moment.unix(stripeSubscription.current_period_end).toISOString(),
            created_at: moment().toISOString(),
            updated_at: moment().toISOString(),
        });

        if (subscriptionError) throw subscriptionError;

        // create free trial record
        const { error: trialError } = await supabase.from("free_trials").insert({
            user_id: userId,
            subscription_tier: getSubscriptionTier(stripePriceId).subscriptionTier,
            stripe_subscription_id: stripeSubscription.id,
            start_date: moment().toISOString(),
            end_date: moment.unix(stripeSubscription.trial_end ?? 0).toISOString(),
            status: FreeTrialStatus.ACTIVE,
            created_at: moment().toISOString(),
            updated_at: moment().toISOString(),
        });

        if (trialError) throw trialError;

        return { success: true, error: null };
    } catch (error) {
        return {
            success: false,
            error: handleSupabaseError(error, "startFreeTrial"),
        };
    }
};
