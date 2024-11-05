"use server";

import { SubscriptionStatus } from "@/enums/SubscriptionStatus";
import { FreeTrialStatus } from "@/enums/FreeTrialStatus";
import {
    CreatePurchasedSubscriptionTableParams,
    StartUserFreeTrialParams,
    UpdateUserSubscriptionStatusParams,
} from "./supabaseInterfaces";
import { createClient, User } from "@supabase/supabase-js";
import { handleSupabaseError } from "../../lib/helper/handleSupabaseError";
import moment from "moment";
import { isOneTimePaymentEnabled } from "@/config/paymentConfig";
import { EmailTemplate, sendEmail } from "@/lib/email/emailService";
import { getProductNameByTier } from "@/lib/helper/PackagesHelper";
import { validateEmailProps } from "@/lib/validation/emailValidation";
import { PricingModel } from "@/interfaces/StripePrices";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

export const getSupabasePowerUser = async () => {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        },
    );
};

const getEndDate = async (stripeSubscriptionId: string) => {
    // If it's a one-time payment, return null as there's no end date
    if (isOneTimePaymentEnabled()) {
        return null;
    }

    // if there's no subscription ID, return null
    if (!stripeSubscriptionId) {
        return null;
    }

    try {
        const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);
        return moment.unix(subscription.current_period_end).toISOString();
    } catch (error) {
        console.error("Error fetching subscription:", error);
        return null;
    }
};

export const createUserTable = async ({ user }: { user: User }) => {
    const supabasePowerUser = await getSupabasePowerUser();

    try {
        const { error } = await supabasePowerUser.from("users").insert({
            id: user.id,
            first_name: user.user_metadata.full_name,
            email: user.email,
            updated_at: moment().toISOString(),
            created_at: moment().toISOString(),
        });

        if (error) throw error;

        return { success: true, error: null };
    } catch (error) {
        return { success: null, error: handleSupabaseError({ error, fnTitle: "createUserTable" }) };
    }
};

export const startUserSubscription = async ({
    userId,
    stripePriceId,
    subscriptionTier,
    stripeSubscriptionId,
    pricingModel,
}: CreatePurchasedSubscriptionTableParams) => {
    const supabase = await getSupabasePowerUser();

    try {
        const endDate = await getEndDate(stripeSubscriptionId ?? "");

        const { error } = await supabase.from("purchased_subscriptions").insert({
            user_id: userId,
            stripe_price_id: stripePriceId,
            status: SubscriptionStatus.ACTIVE,
            subscription_tier: subscriptionTier,
            stripe_subscription_id: stripeSubscriptionId,
            pricing_model: pricingModel,
            end_date: endDate,
            updated_at: moment().toISOString(),
            created_at: moment().toISOString(),
        });

        if (error) throw error;

        try {
            const { data: userData, error: userError } = await supabase
                .from("users")
                .select("first_name, email")
                .eq("id", userId)
                .single();

            if (userError) {
                console.error("Failed to fetch user data for email:", userError);
                return { success: true, error: null }; // return success even if database call fails as we still want to create the subscription
            }

            const purchasedPackage = await getProductNameByTier(subscriptionTier);

            const { error: validationError } = validateEmailProps(
                EmailTemplate.SUBSCRIPTION_CONFIRMATION,
                {
                    userEmail: userData.email,
                    userFirstName: userData.first_name,
                    purchasedPackage,
                },
            );

            if (validationError) {
                console.error("Invalid email props:", validationError);
                return { success: true, error: null };
            }

            await sendEmail(EmailTemplate.SUBSCRIPTION_CONFIRMATION, {
                userEmail: userData.email,
                userFirstName: userData.first_name,
                purchasedPackage,
            });
        } catch (emailError) {
            console.error("Failed to send onboarding email:", emailError);
        }

        return { success: true, error: null };
    } catch (error) {
        return {
            success: null,
            error: handleSupabaseError({ error, fnTitle: "startUserSubscription" }),
        };
    }
};

export const updateUserSubscription = async ({
    userId,
    stripePriceId,
    status,
    subscriptionTier,
    stripeSubscriptionId,
    pricingModel,
}: UpdateUserSubscriptionStatusParams) => {
    const supabase = await getSupabasePowerUser();

    try {
        const endDate = await getEndDate(stripeSubscriptionId ?? "");

        const { error } = await supabase
            .from("purchased_subscriptions")
            .update({
                stripe_price_id: stripePriceId,
                status,
                subscription_tier: subscriptionTier,
                stripe_subscription_id: stripeSubscriptionId,
                pricing_model: pricingModel,
                end_date: endDate,
                updated_at: moment().toISOString(),
            })
            .eq("user_id", userId);

        if (error) throw error;

        return { success: true, error: null };
    } catch (error) {
        return {
            success: null,
            error: handleSupabaseError({ error, fnTitle: "updateUserSubscription" }),
        };
    }
};

export const startUserFreeTrial = async ({
    userId,
    stripePriceId,
    freeTrialEndDate,
}: StartUserFreeTrialParams) => {
    const supabase = await getSupabasePowerUser();

    try {
        const { error } = await supabase.from("free_trials").insert({
            user_id: userId,
            start_date: moment().toISOString(),
            end_date: moment(freeTrialEndDate).toISOString(),
            stripe_price_id: stripePriceId,
            status: FreeTrialStatus.ACTIVE,
            updated_at: moment().toISOString(),
            created_at: moment().toISOString(),
        });

        if (error) throw error;

        return { success: true, error: null };
    } catch (error) {
        return {
            success: null,
            error: handleSupabaseError({ error, fnTitle: "startUserFreeTrial" }),
        };
    }
};

export const endUserFreeTrial = async ({ userId }: { userId: string }) => {
    const supabase = await getSupabasePowerUser();

    try {
        const { error } = await supabase
            .from("free_trials")
            .update({
                updated_at: moment().toISOString(),
                status: FreeTrialStatus.EXPIRED,
            })
            .eq("user_id", userId);

        await supabase.auth.admin.updateUserById(userId, {
            user_metadata: {
                free_trial_status: FreeTrialStatus.EXPIRED,
            },
        });

        if (error) throw error;

        return { success: true, error: null };
    } catch (error) {
        return {
            success: null,
            error: handleSupabaseError({ error, fnTitle: "endUserFreeTrial" }),
        };
    }
};

export const endUserSubscription = async (userId: string) => {
    const supabase = await getSupabasePowerUser();

    try {
        const { error } = await supabase
            .from("purchased_subscriptions")
            .update({
                updated_at: moment().toISOString(),
                status: SubscriptionStatus.EXPIRED,
            })
            .eq("user_id", userId);

        await supabase.auth.admin.updateUserById(userId, {
            user_metadata: {
                subscription_status: SubscriptionStatus.EXPIRED,
            },
        });

        if (error) throw error;

        return { success: true, error: null };
    } catch (error) {
        return {
            success: null,
            error: handleSupabaseError({ error, fnTitle: "endUserSubscription" }),
        };
    }
};

export const cancelUserFreeTrial = async ({ userId }: { userId: string }) => {
    const supabase = await getSupabasePowerUser();

    try {
        const { error } = await supabase
            .from("free_trials")
            .update({
                updated_at: moment().toISOString(),
                status: FreeTrialStatus.CANCELLED,
            })
            .eq("user_id", userId);

        await supabase.auth.admin.updateUserById(userId, {
            user_metadata: {
                free_trial_status: FreeTrialStatus.CANCELLED,
            },
        });

        if (error) throw error;

        return { success: true, error: null };
    } catch (error) {
        return {
            success: null,
            error: handleSupabaseError({ error, fnTitle: "cancelUserFreeTrial" }),
        };
    }
};

export const cancelUserSubscription = async (userId: string, endDate: string) => {
    const supabase = await getSupabasePowerUser();

    try {
        const { error } = await supabase
            .from("purchased_subscriptions")
            .update({
                updated_at: moment().toISOString(),
                status: SubscriptionStatus.CANCELLED,
                end_date: endDate,
            })
            .eq("user_id", userId);

        await supabase.auth.admin.updateUserById(userId, {
            user_metadata: {
                subscription_status: SubscriptionStatus.CANCELLED,
            },
        });

        if (error) throw error;

        return { success: true, error: null };
    } catch (error) {
        return {
            success: null,
            error: handleSupabaseError({ error, fnTitle: "cancelUserSubscription" }),
        };
    }
};

export const updateUserStripeCustomerId = async (userId: string, stripeCustomerId: string) => {
    const supabase = await getSupabasePowerUser();

    try {
        const { error } = await supabase
            .from("users")
            .update({
                stripe_customer_id: stripeCustomerId,
                updated_at: moment().toISOString(),
            })
            .eq("id", userId);

        if (error) throw error;

        return { success: true, error: null };
    } catch (error) {
        return {
            success: null,
            error: handleSupabaseError({ error, fnTitle: "updateUserStripeCustomerId" }),
        };
    }
};
