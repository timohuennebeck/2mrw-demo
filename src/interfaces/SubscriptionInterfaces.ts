import { SubscriptionStatus } from "@/enums/SubscriptionStatus";
import { SubscriptionTier } from "@/enums/SubscriptionTier";
import { PricingModel } from "./StripePrices";

export interface UpsertUserSubscriptionParams {
    userId: string;
    stripePriceId: string;
    subscriptionTier: SubscriptionTier;
    stripeSubscriptionId?: string;
    pricingModel: PricingModel;
}

export interface PurchasedSubscription {
    id: number;
    stripe_price_id: string;
    stripe_subscription_id: string;
    user_id: string;
    status: SubscriptionStatus;
    subscription_tier: SubscriptionTier;
    pricing_model: PricingModel;
    end_date: string;
    updated_at: Date;
    created_at: Date;
}
