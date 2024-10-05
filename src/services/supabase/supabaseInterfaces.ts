import { SubscriptionStatus } from "@/enums/SubscriptionStatus";
import { SubscriptionTier } from "@/enums/SubscriptionTier";
import { Moment } from "moment";

export interface CreatePurchasedSubscriptionTableParams {
    userId: string;
    stripePriceId: string;
    subscriptionTier: SubscriptionTier;
}

export interface UpdateUserSubscriptionStatusParams {
    userId: string;
    stripePriceId: string;
    status: SubscriptionStatus;
    subscriptionTier: SubscriptionTier;
}

export interface StartUserFreeTrialParams {
    userId: string;
    stripePriceId: string;
    freeTrialEndDate: Moment;
}
