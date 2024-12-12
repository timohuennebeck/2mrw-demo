import { FreeTrialStatus, SubscriptionTier } from "@/enums";

export interface FreeTrial {
    id: number;
    user_id: string;
    subscription_tier: SubscriptionTier;
    stripe_subscription_id: string;
    start_date: string;
    end_date: string;
    status: FreeTrialStatus;
    created_at: string;
    updated_at: string;
}
