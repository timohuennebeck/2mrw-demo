import { ProductWithPrices, PurchasedSubscription } from "@/interfaces";
import { SubscriptionInterval, SubscriptionStatus } from "@/enums";
import { User } from "@supabase/supabase-js";

export interface PricingPlanCardParams extends ProductWithPrices {
    supabaseUser: User | null;
    subscriptionStatus: SubscriptionStatus;
    subscriptionData: PurchasedSubscription | null;
    isLoading: boolean;
    billingCycle: SubscriptionInterval;
    setBillingCycle: (state: SubscriptionInterval) => void;
}
