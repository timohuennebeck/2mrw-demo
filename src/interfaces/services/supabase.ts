import { BillingPeriod, BillingPlan, FreeTrialStatus, SubscriptionStatus, SubscriptionTier } from "../../enums";

export interface CreatePurchasedSubscriptionTableParams {
    userId: string;
    stripePriceId: string | null;
    subscriptionTier: SubscriptionTier;
    stripeSubscriptionId?: string | null;
    billingPlan: BillingPlan;
}

export interface UpdateUserSubscriptionParams {
    userId: string;
    stripePriceId: string;
    subscriptionTier: SubscriptionTier;
    stripeSubscriptionId: string | null;
    status?: SubscriptionStatus;
    billingPeriod: BillingPeriod;
    billingPlan: BillingPlan;
    endDate: string | null;
}