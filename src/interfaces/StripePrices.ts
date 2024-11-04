export enum PricingModel {
    ONE_TIME = "one_time",
    SUBSCRIPTION = "subscription",
}

export enum SubscriptionInterval {
    MONTHLY = "monthly",
    YEARLY = "yearly",
}

export interface StripePrice {
    id: string;
    product_id: string;
    pricing_model: PricingModel;
    subscription_interval?: SubscriptionInterval; // null for one-time prices
    current_amount: number;
    previous_amount?: number;
    currency: string;
    stripe_price_id: string;
    updated_at: string;
    created_at: string;
}
