import { User } from "@supabase/supabase-js";
import { FreeTrialStatus } from "@/enums/FreeTrialStatus";
import { SubscriptionStatus } from "@/enums/SubscriptionStatus";

export const hasUserPremiumOrFreeTrial = (user: User | null) => {
    if (!user) return false;

    const hasPremiumSubscription =
        user.user_metadata?.subscription_status === SubscriptionStatus.ACTIVE ||
        user.user_metadata?.subscription_status === SubscriptionStatus.CANCELLED;
    const isOnFreeTrial =
        user.user_metadata?.free_trial_status === FreeTrialStatus.ACTIVE ||
        user.user_metadata?.free_trial_status === FreeTrialStatus.CANCELLED;

    return hasPremiumSubscription || isOnFreeTrial;
};
