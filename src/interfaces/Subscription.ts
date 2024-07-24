import { SubscriptionStatus } from "@/app/enums/SubscriptionStatus";

export interface Subscription {
    id: number;
    created_at: string;
    updated_at: string;
    user_id: number;
    stripe_price_id: string;
    status: SubscriptionStatus;
}
