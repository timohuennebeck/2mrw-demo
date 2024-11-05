import { SubscriptionTier } from "@/enums/SubscriptionTier";
import { PricingModel, StripePrice } from "./StripePrices";

export interface Product {
    id: string;
    name: string;
    description: string;
    pricing_model: PricingModel;
    is_highlighted: boolean;
    is_active: boolean;
    subscription_tier: SubscriptionTier;
    updated_at: string;
    created_at: string;
}

export interface ProductWithPrices extends Product {
    prices: StripePrice[];
}
