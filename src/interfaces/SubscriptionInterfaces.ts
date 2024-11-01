import { SubscriptionStatus } from "@/enums/SubscriptionStatus";
import { SubscriptionTier } from "@/enums/SubscriptionTier";

export interface UpsertUserSubscriptionParams {
    userId: string;
    stripePriceId: string;
    subscriptionTier: SubscriptionTier;
}

export interface PurchasedSubscription {
    id: number;
    stripe_price_id: string;
    user_id: string;
    status: SubscriptionStatus;
    subscription_tier: SubscriptionTier;
    end_date: string;
    updated_at: Date;
    created_at: Date;
}
