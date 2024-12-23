"use server";

import { stripe } from "@/services/stripe/client";

export const deleteUserInStripe = async (stripeCustomerId: string) => {
  if (!stripeCustomerId) return;

  try {
    await stripe.customers.del(stripeCustomerId);
  } catch (error) {
    console.error("Error deleting user in Stripe:", error);
  }
};
