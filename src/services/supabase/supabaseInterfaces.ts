import { SubscriptionStatus } from "@/enums/SubscriptionStatus";
import { SubscriptionTier } from "@/enums/SubscriptionTier";
import { PricingModel } from "@/interfaces/StripePrices";

export interface CreatePurchasedSubscriptionTableParams {
    userId: string;
    stripePriceId: string | null;
    subscriptionTier: SubscriptionTier;
    stripeSubscriptionId?: string | null;
    pricingModel: PricingModel;
}

export interface UpdateUserSubscriptionStatusParams {
    userId: string;
    stripePriceId: string;
    status: SubscriptionStatus;
    subscriptionTier: SubscriptionTier;
    stripeSubscriptionId?: string;
    pricingModel: PricingModel;
}

export interface StartUserFreeTrialParams {
    userId: string;
    stripePriceId: string;
    freeTrialEndDate: string;
}
