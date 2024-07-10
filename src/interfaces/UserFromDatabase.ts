export interface UserFromDatabase {
    id: number;
    created_at: number;
    email: string;
    stripe_price_id: string;
    has_premium: boolean;
    subscription_plan: string;
}
