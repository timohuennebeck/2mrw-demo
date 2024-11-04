"use server";

import { SubscriptionStatus } from "@/enums/SubscriptionStatus";
import { FreeTrialStatus } from "@/enums/FreeTrialStatus";
import {
    CreatePurchasedSubscriptionTableParams,
    StartUserFreeTrialParams,
    UpdateUserSubscriptionStatusParams,
} from "./supabaseInterfaces";
import { createClient, SupabaseClient, User } from "@supabase/supabase-js";
import { handleSupabaseError } from "../../lib/helper/handleSupabaseError";
import moment from "moment";
import { PaymentEnums } from "@/enums/PaymentEnums";
import { isOneTimePaymentEnabled } from "@/config/paymentConfig";
import { fetchProducts } from "./queries";
import { EmailTemplate, sendEmail } from "@/lib/email/emailService";
import { getProductNameByTier } from "@/lib/helper/PackagesHelper";
import { validateEmailProps } from "@/lib/validation/emailValidation";

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

const getEndDate = async (stripePriceId: string) => {
    if (isOneTimePaymentEnabled()) {
        return null; // one-time payments don't have an end date
    }

    // fetch products to check price IDs
    const { products } = await fetchProducts();
    if (!products) throw new Error("Failed to fetch products");

    // check if the stripePriceId matches any yearly subscription
    const isYearlySubscription = products.some(
        (product) => product.pricing.subscription?.yearly?.stripe_price_id === stripePriceId,
    );

    const currentDate = moment();

    return isYearlySubscription
        ? currentDate.add(1, "year").toISOString()
        : currentDate.add(1, "month").toISOString();
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
}: CreatePurchasedSubscriptionTableParams) => {
    const supabase = await getSupabasePowerUser();

    try {
        const endDate = await getEndDate(stripePriceId);

        const { error } = await supabase.from("purchased_subscriptions").insert({
            user_id: userId,
            stripe_price_id: stripePriceId,
            status: SubscriptionStatus.ACTIVE,
            subscription_tier: subscriptionTier,
            stripe_subscription_id: stripeSubscriptionId,
            billing_method: isOneTimePaymentEnabled()
                ? PaymentEnums.ONE_TIME
                : PaymentEnums.SUBSCRIPTION,
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

            const { error: validationError } = validateEmailProps(EmailTemplate.SUBSCRIPTION_CONFIRMATION, {
                userEmail: userData.email,
                userFirstName: userData.first_name,
                purchasedPackage,
            });

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
}: UpdateUserSubscriptionStatusParams) => {
    const supabase = await getSupabasePowerUser();

    try {
        const endDate = await getEndDate(stripePriceId);

        const { error } = await supabase
            .from("purchased_subscriptions")
            .update({
                stripe_price_id: stripePriceId,
                status,
                subscription_tier: subscriptionTier,
                stripe_subscription_id: stripeSubscriptionId,
                billing_method: isOneTimePaymentEnabled()
                    ? PaymentEnums.ONE_TIME
                    : PaymentEnums.SUBSCRIPTION,
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

export const cancelUserSubscription = async (userId: string) => {
    const supabase = await getSupabasePowerUser();

    try {
        const { error } = await supabase
            .from("purchased_subscriptions")
            .update({
                updated_at: moment().toISOString(),
                status: SubscriptionStatus.CANCELLED,
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
