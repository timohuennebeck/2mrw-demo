import { SubscriptionTier } from "@/enums/SubscriptionTier";

export interface Feature {
    name: string;
    included: boolean;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    previous_price: number;
    current_price: number;
    stripe_price_id: string;
    is_highlighted: boolean;
    features: Feature[];
    is_active: boolean;
    subscription_tier: SubscriptionTier;
    updated_at: Date;
    created_at: Date;
}
