"use server";

import { billingConfig } from "@/config";
import { FreeTrialStatus, SubscriptionStatus } from "@/enums";
import { handleSupabaseError } from "@/utils/errors/supabaseError";
import moment from "moment";
import { getPricingPlan } from "../domain/pricingService";
import { createClient } from "../integration/server";
import { stripe } from "../stripe/client";
import { getStripeCustomerId } from "../stripe/stripeCustomer";
import { updateUserSubscription } from "./subscriptionService";

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

        await updateUserSubscription({
            userId,
            stripePriceId,
            stripeSubscriptionId: stripeSubscription.id,
            status: SubscriptionStatus.TRIALING,
            subscriptionTier: plan.subscription_tier,
            billingPeriod: plan.billing_period,
            billingPlan: plan.billing_plan,
            endDate: moment.unix(stripeSubscription.current_period_end).toISOString(),
        });

        await supabase.from("free_trials").insert({
            user_id: userId,
            subscription_tier: plan.subscription_tier,
            stripe_subscription_id: stripeSubscription.id,
            status: FreeTrialStatus.ACTIVE,
            start_date: moment().toISOString(),
            end_date: moment.unix(stripeSubscription.trial_end ?? 0).toISOString(),
            created_at: moment().toISOString(),
            updated_at: moment().toISOString(),
        });
    } catch (error) {
        return {
            success: false,
            error: handleSupabaseError(error, "startFreeTrial"),
        };
    }
};
