import { StripePrice } from "@/interfaces";
import { SubscriptionInterval } from "@/enums";

export interface PlanPricingParams {
    prices: StripePrice[];
    billingCycle: SubscriptionInterval;
}
