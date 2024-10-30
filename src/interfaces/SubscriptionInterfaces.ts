import { SubscriptionStatus } from "@/enums/SubscriptionStatus";
import { SubscriptionTier } from "@/enums/SubscriptionTier";

export interface UpsertUserSubscriptionParams {
    userId: string;
    stripePriceId: string;
    subscriptionTier: SubscriptionTier;
}

export interface PurchasedSubscription {
    id: number;
    created_at: string;
    updated_at: string;
    end_date: string;
    user_id: string;
    stripe_price_id: string;
    status: SubscriptionStatus;
    subscription_tier: SubscriptionTier;
}
