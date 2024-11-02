import { PaymentEnums } from "@/enums/PaymentEnums";
import { SubscriptionTier } from "@/enums/SubscriptionTier";

export interface PricePoint {
    previous?: number;
    current: number;
    stripe_price_id: string;
    currency: string;
}

export interface ProductPricing {
    one_time?: PricePoint;
    subscription?: {
        monthly?: PricePoint;
        yearly?: PricePoint;
    };
}

export interface Feature {
    name: string;
    included: boolean;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    pricing: ProductPricing;
    is_highlighted: boolean;
    features: Feature[];
    is_active: boolean;
    subscription_tier: SubscriptionTier;
    payment_type: PaymentEnums;
    updated_at: Date;
    created_at: Date;
}
