import { SubscriptionTier } from "@/enums/SubscriptionTier";
import { PricingModel } from "./StripePrices";

export interface Feature {
    name: string;
    included: boolean;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    pricing_model: PricingModel;
    is_highlighted: boolean;
    features: Feature[];
    is_active: boolean;
    subscription_tier: SubscriptionTier;
    updated_at: string;
    created_at: string;
}
