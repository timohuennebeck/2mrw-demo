import { SubscriptionStatus } from "@/enums/SubscriptionStatus";
import { SubscriptionTier } from "@/enums/SubscriptionTier";
import { SupabaseClient, User } from "@supabase/supabase-js";

export interface CreateUserTableParams {
    supabase: SupabaseClient;
    user: User;
}

export interface CreatePurchasedSubscriptionTableParams {
    supabase: SupabaseClient;
    userId: string;
    stripePriceId: string;
    subscriptionTier: SubscriptionTier;
}

export interface UpdateUserSubscriptionStatusParams {
    supabase: SupabaseClient;
    userId: string;
    stripePriceId: string;
    status: SubscriptionStatus;
    subscriptionTier: SubscriptionTier;
}

export interface StartUserFreeTrialParams {
    supabase: SupabaseClient;
    userId: string;
    stripePriceId: string;
    freeTrialEndDate: Date;
}

export interface EndUserFreeTrialParams {
    supabase: SupabaseClient;
    userId: string;
}
