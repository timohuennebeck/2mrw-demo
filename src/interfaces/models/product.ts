import { BillingPlan, SubscriptionTier } from "../../enums";
import { StripePrice } from "./price";

export interface Product {
    id: string;
    name: string;
    description: string;
    billing_plan: BillingPlan;
    is_highlighted: boolean;
    is_active: boolean;
    subscription_tier: SubscriptionTier;
    updated_at: string;
    created_at: string;
}

export interface ProductWithPrices extends Product {
    prices: StripePrice[];
}