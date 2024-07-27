import { SubscriptionTier } from "@/enums/SubscriptionTier";

interface Feature {
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
    stripe_purchase_link: string;
    is_highlighted: boolean;
    features: Feature[];
    is_active: boolean;
    subscription_tier: SubscriptionTier;
    created_at: Date;
    updated_at: Date;
}
