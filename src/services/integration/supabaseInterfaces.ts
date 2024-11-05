import { SubscriptionStatus } from "@/enums/SubscriptionStatus";
import { SubscriptionTier } from "@/enums/SubscriptionTier";
import { BillingPlan } from "@/interfaces/StripePrices";

export interface CreatePurchasedSubscriptionTableParams {
    userId: string;
    stripePriceId: string | null;
    subscriptionTier: SubscriptionTier;
    stripeSubscriptionId?: string | null;
    billingPlan: BillingPlan;
}

export interface UpdateUserSubscriptionStatusParams {
    userId: string;
    stripePriceId: string;
    subscriptionTier: SubscriptionTier;
    stripeSubscriptionId?: string;
    billingPlan: BillingPlan;
}

export interface StartUserFreeTrialParams {
    userId: string;
    stripePriceId: string;
    freeTrialEndDate: string;
}
