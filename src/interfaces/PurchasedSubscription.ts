import { SubscriptionStatus } from "@/enums/SubscriptionStatus";
import { SubscriptionTier } from "@/enums/SubscriptionTier";

export interface PurchasedSubscription {
    id: number;
    created_at: string;
    updated_at: string;
    user_id: number;
    stripe_price_id: string;
    status: SubscriptionStatus;
    subscription_tier: SubscriptionTier;
}
