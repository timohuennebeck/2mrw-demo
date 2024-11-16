import { BillingPlan, SubscriptionStatus, SubscriptionTier } from "../../enums";

export interface UpsertUserSubscriptionParams {
    userId: string;
    stripePriceId: string;
    subscriptionTier: SubscriptionTier;
    stripeSubscriptionId?: string;
    billingPlan: BillingPlan;
}

export interface PurchasedSubscription {
    id: number;
    stripe_price_id: string;
    stripe_subscription_id: string;
    user_id: string;
    status: SubscriptionStatus;
    subscription_tier: SubscriptionTier;
    billing_plan: BillingPlan;
    end_date: string;
    updated_at: string;
    created_at: string;
}
