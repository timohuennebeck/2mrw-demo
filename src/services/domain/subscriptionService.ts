import { User } from "@supabase/supabase-js";
import { SubscriptionStatus } from "@/interfaces";

export const hasUserPremiumPlan = (authUser: User | null) => {
    if (!authUser) return false;

    const hasPremiumSubscription =
        authUser.user_metadata?.subscription_status === SubscriptionStatus.ACTIVE ||
        authUser.user_metadata?.subscription_status === SubscriptionStatus.CANCELLED;

    return hasPremiumSubscription;
};
