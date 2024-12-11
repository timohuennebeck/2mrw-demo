import { BillingPlan, SubscriptionTier } from "../../enums";

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
    stripeSubscriptionId?: string | null;
    endDate: string | null;
    billingPlan: BillingPlan;
}