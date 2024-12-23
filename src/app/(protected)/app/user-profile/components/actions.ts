"use server";

import { stripe } from "@/services/stripe/client";
import { createSupabasePowerUserClient } from "@/services/integration/admin";

export async function cancelStripeSubscription(userId: string) {
  try {
    const adminSupabase = await createSupabasePowerUserClient();

    const { data: subscription } = await adminSupabase
      .from("user_subscriptions")
      .select("stripe_subscription_id")
      .eq("user_id", userId)
      .single();

    if (subscription?.stripe_subscription_id) {
      await stripe.subscriptions.cancel(subscription.stripe_subscription_id);
      return { success: true };
    }

    return { success: true };
  } catch (error) {
    console.error("Error cancelling stripe subscription:", error);
    return { success: false, error: "Failed to cancel subscription" };
  }
}
