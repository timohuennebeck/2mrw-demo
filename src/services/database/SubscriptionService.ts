"use server";

import { PurchasedSubscription } from "@/interfaces/SubscriptionInterfaces";
import {
    CreatePurchasedSubscriptionTableParams,
    UpdateUserSubscriptionStatusParams,
} from "../integration/supabaseInterfaces";
import { SubscriptionStatus } from "@/enums/SubscriptionStatus";
import moment from "moment";
import { EmailTemplate } from "@/lib/email/emailService";
import { validateEmailProps } from "@/lib/validation/emailValidation";
import { sendEmail } from "@/lib/email/emailService";
import { checkRowExists, getEndDate } from "./BaseService";
import { handleSupabaseError } from "@/lib/helper/SupabaseHelper";
import { getProductNameByTier } from "./ProductService";
import { SubscriptionTier } from "@/enums/SubscriptionTier";
import { createClient } from "../integration/server";
import { createSupabasePowerUserClient } from "../integration/admin";
import { BillingPlan } from "@/interfaces/StripePrices";

const _sendSubscriptionConfirmationEmail = async (
    userId: string,
    subscriptionTier: SubscriptionTier,
) => {
    try {
        const supabase = await createClient();

        const { data: userData, error: userError } = await supabase
            .from("users")
            .select("first_name, email")
            .eq("id", userId)
            .single();

        if (userError) {
            console.error("Failed to fetch user data for email:", userError);
            return { success: true, error: null };
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
};

export const fetchUserSubscription = async (userId: string) => {
    try {
        const supabase = await createClient();

        const defaultResponse = {
            subscription: null,
            error: null,
        };

        const { rowExists, error: rowCheckError } = await checkRowExists(
            "user_subscriptions",
            userId,
        );

        if (rowCheckError) throw rowCheckError;

        if (!rowExists) return defaultResponse;

        const { data: subscription, error } = await supabase
            .from("user_subscriptions")
            .select("*")
            .eq("user_id", userId)
            .single();

        if (error) throw error;

        return {
            subscription: subscription as PurchasedSubscription,
            error: null,
        };
    } catch (error) {
        return {
            subscription: null,
            error: handleSupabaseError({ error, fnTitle: "fetchUserSubscription" }),
        };
    }
};

export const startUserSubscription = async ({
    userId,
    stripePriceId,
    subscriptionTier,
    stripeSubscriptionId,
    billingPlan,
}: CreatePurchasedSubscriptionTableParams) => {
    try {
        const adminSupabase = await createSupabasePowerUserClient();

        const endDate = await getEndDate(stripeSubscriptionId ?? "");

        const { error } = await adminSupabase.from("user_subscriptions").insert({
            user_id: userId,
            stripe_price_id: stripePriceId,
            status: SubscriptionStatus.ACTIVE,
            subscription_tier: subscriptionTier,
            stripe_subscription_id: stripeSubscriptionId,
            billing_plan: billingPlan,
            end_date: endDate,
            updated_at: moment().toISOString(),
            created_at: moment().toISOString(),
        });

        if (error) throw error;

        await adminSupabase.auth.admin.updateUserById(userId, {
            user_metadata: {
                subscription_status: SubscriptionStatus.ACTIVE,
                subscription_updated_at: moment().toISOString(),
            },
        });

        await _sendSubscriptionConfirmationEmail(userId, subscriptionTier);

        return { success: true, error: null };
    } catch (error) {
        return {
            success: null,
            error: handleSupabaseError({ error, fnTitle: "startUserSubscription" }),
        };
    }
};

export const terminateUserSubscription = async (userId: string) => {
    /**
     * this function is used to terminate the users subscription
     * its run inside the cron jobs to end the subscription and downgrade the user to the free plan
     */

    try {
        const adminSupabase = await createSupabasePowerUserClient();

        const { error } = await adminSupabase
            .from("user_subscriptions")
            .update({
                updated_at: moment().toISOString(),
                status: SubscriptionStatus.EXPIRED,
            })
            .eq("user_id", userId);

        await adminSupabase.auth.admin.updateUserById(userId, {
            user_metadata: {
                subscription_status: SubscriptionStatus.EXPIRED,
            },
        });

        if (error) throw error;

        return { success: true, error: null };
    } catch (error) {
        return {
            success: null,
            error: handleSupabaseError({ error, fnTitle: "terminateUserSubscription" }),
        };
    }
};

export const updateUserSubscription = async ({
    userId,
    stripePriceId,
    subscriptionTier,
    stripeSubscriptionId,
    endDate,
    billingPlan,
}: UpdateUserSubscriptionStatusParams) => {
    try {
        const adminSupabase = await createSupabasePowerUserClient();

        const { error } = await adminSupabase
            .from("user_subscriptions")
            .update({
                stripe_price_id: stripePriceId,
                status: SubscriptionStatus.ACTIVE,
                subscription_tier: subscriptionTier,
                stripe_subscription_id: stripeSubscriptionId,
                billing_plan: billingPlan,
                end_date: endDate,
                updated_at: moment().toISOString(),
            })
            .eq("user_id", userId);

        if (error) throw error;

        await adminSupabase.auth.admin.updateUserById(userId, {
            user_metadata: {
                subscription_status: SubscriptionStatus.ACTIVE,
                subscription_updated_at: moment().toISOString(),
            },
        });

        return { success: true, error: null };
    } catch (error) {
        return {
            success: null,
            error: handleSupabaseError({ error, fnTitle: "updateUserSubscription" }),
        };
    }
};

export const downgradeUserToFreePlan = async (userId: string) => {
    try {
        const adminSupabase = await createSupabasePowerUserClient();

        const { error } = await adminSupabase
            .from("user_subscriptions")
            .update({
                status: SubscriptionStatus.ACTIVE,
                subscription_tier: SubscriptionTier.FREE,
                billing_plan: BillingPlan.NONE,
                stripe_price_id: null,
                stripe_subscription_id: null,
                end_date: null,
                updated_at: moment().toISOString(),
            })
            .eq("user_id", userId);

        await adminSupabase.auth.admin.updateUserById(userId, {
            user_metadata: {
                subscription_status: SubscriptionStatus.ACTIVE,
                subscription_updated_at: moment().toISOString(),
            },
        });

        if (error) throw error;
        return { success: true, error: null };
    } catch (error) {
        return {
            success: null,
            error: handleSupabaseError({ error, fnTitle: "startFreePlan" }),
        };
    }
};

export const startFreePlan = async (userId: string) => {
    try {
        const adminSupabase = await createSupabasePowerUserClient();

        const { error } = await adminSupabase.from("user_subscriptions").insert({
            user_id: userId,
            status: SubscriptionStatus.ACTIVE,
            subscription_tier: SubscriptionTier.FREE,
            billing_plan: BillingPlan.NONE,
            stripe_price_id: null,
            stripe_subscription_id: null,
            end_date: null,
            updated_at: moment().toISOString(),
        });

        await adminSupabase.auth.admin.updateUserById(userId, {
            user_metadata: {
                subscription_status: SubscriptionStatus.ACTIVE,
                subscription_updated_at: moment().toISOString(),
            },
        });

        if (error) throw error;
        return { success: true, error: null };
    } catch (error) {
        return {
            success: null,
            error: handleSupabaseError({ error, fnTitle: "startFreePlan" }),
        };
    }
};

export const cancelUserSubscription = async (userId: string, endDate: string) => {
    try {
        const adminSupabase = await createSupabasePowerUserClient();

        const { error } = await adminSupabase
            .from("user_subscriptions")
            .update({
                updated_at: moment().toISOString(),
                status: SubscriptionStatus.CANCELLED,
                end_date: endDate,
            })
            .eq("user_id", userId);

        await adminSupabase.auth.admin.updateUserById(userId, {
            user_metadata: {
                subscription_status: SubscriptionStatus.CANCELLED,
                subscription_updated_at: moment().toISOString(),
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
