import { BillingPeriod, BillingPlan, SubscriptionStatus, SubscriptionTier } from "../../enums";

export interface PurchasedSubscription {
    id: number;
    user_id: string;
    stripe_price_id: string;
    stripe_subscription_id: string;
    status: SubscriptionStatus;
    subscription_tier: SubscriptionTier;
    billing_period: BillingPeriod;
    billing_plan: BillingPlan;
    end_date: string;
    created_at: string;
    updated_at: string;
}
