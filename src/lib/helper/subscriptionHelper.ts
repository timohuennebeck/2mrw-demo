import { User } from "@supabase/supabase-js";
import { FreeTrialStatus } from "@/enums/FreeTrialStatus";
import { SubscriptionStatus } from "@/enums/SubscriptionStatus";

export const hasUserPremiumOrFreeTrial = (authUser: User | null) => {
    if (!authUser) return false;

    const hasPremiumSubscription =
        authUser.user_metadata?.subscription_status === SubscriptionStatus.ACTIVE ||
        authUser.user_metadata?.subscription_status === SubscriptionStatus.CANCELLED;
    const isOnFreeTrial =
        authUser.user_metadata?.free_trial_status === FreeTrialStatus.ACTIVE ||
        authUser.user_metadata?.free_trial_status === FreeTrialStatus.CANCELLED;

    return hasPremiumSubscription || isOnFreeTrial;
};
