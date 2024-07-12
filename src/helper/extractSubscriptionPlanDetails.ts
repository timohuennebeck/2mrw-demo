import { SUBSCRIPTION_PLANS, StripePriceId } from "@/config/subscriptionPlans";

export function extractSubscriptionPlanDetails(stripePriceId: StripePriceId) {
    const plan = SUBSCRIPTION_PLANS.find((plan) => plan.stripePriceId === stripePriceId);

    if (!plan) {
        throw new Error(`Error, no plan found for price id: ${stripePriceId}`);
    }
    return plan;
}
