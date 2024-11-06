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
    endDate: string;
    billingPlan: BillingPlan;
}
