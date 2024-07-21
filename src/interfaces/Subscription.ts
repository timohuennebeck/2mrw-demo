export interface Subscription {
    id: number;
    created_at: string;
    updated_at: string;
    user_id: number;
    stripe_price_id: string;
    subscription_plan: number;
    has_premium: boolean;
}
