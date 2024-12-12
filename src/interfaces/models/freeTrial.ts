import { FreeTrialStatus, SubscriptionTier } from "@/enums";

export interface FreeTrial {
    id: string;
    user_id: string;
    subscription_tier: SubscriptionTier;
    stripe_subscription_id: string;
    status: FreeTrialStatus;
    start_date: string;
    end_date: string;
    created_at: string;
    updated_at: string;
}
