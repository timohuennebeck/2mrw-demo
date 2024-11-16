import { SubscriptionTier, SubscriptionStatus } from "@/enums";
import { PurchasedSubscription } from "@/interfaces";
import { User } from "@supabase/supabase-js";

export interface PlanButtonParams {
    stripePriceId: string;
    subscriptionTier: SubscriptionTier;
    subscriptionStatus: SubscriptionStatus | null;
    subscriptionData: PurchasedSubscription | null;
    isLoading: boolean;
    supabaseUser: User | null;
    name: string;
}
