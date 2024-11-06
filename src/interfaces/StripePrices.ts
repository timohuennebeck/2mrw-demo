export enum BillingPlan {
    NONE = "NONE", // no plan selected -> Free Users
    ONE_TIME = "ONE_TIME", // one-time payment -> Premium Users
    RECURRING = "RECURRING", // recurring payment -> Premium Users
}

export enum SubscriptionInterval {
    FREE = "FREE",
    MONTHLY = "MONTHLY",
    YEARLY = "YEARLY",
}

export interface StripePrice {
    id: string;
    product_id: string;
    billing_plan: BillingPlan;
    is_active: boolean;
    subscription_interval?: SubscriptionInterval; // null for one-time prices
    current_amount: number;
    previous_amount?: number;
    stripe_price_id: string;
    updated_at: string;
    created_at: string;
}
