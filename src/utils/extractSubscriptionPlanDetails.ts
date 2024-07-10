import { SUBSCRIPTION_PLANS, StripePriceId } from "@/config/subscriptionPlans";

export function extractSubscriptionPlanDetails(priceId: StripePriceId) {
    const plan = SUBSCRIPTION_PLANS.find((plan) => plan.priceId === priceId);

    if (!plan) {
        throw new Error(`Error, no plan found for price id: ${priceId}`);
    }
    return plan;
}
