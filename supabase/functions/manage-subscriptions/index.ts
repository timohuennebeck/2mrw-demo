import { createClient } from "npm:@supabase/supabase-js";
import moment from "npm:moment";
import { Redis } from "npm:@upstash/redis";

export enum SubscriptionStatus {
  ACTIVE = "ACTIVE",
  TRIALING = "TRIALING",
  CANCELLED = "CANCELLED",
  EXPIRED = "EXPIRED",
}

export enum SubscriptionTier {
  FREE = "FREE",
  ESSENTIALS = "ESSENTIALS",
  FOUNDERS = "FOUNDERS",
}

export enum BillingPlan {
  RECURRING = "RECURRING",
  ONE_TIME = "ONE_TIME",
}

export enum BillingPeriod {
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
  LIFETIME = "LIFETIME",
}

export interface PurchasedSubscription {
  id: string;
  user_id: string;
  stripe_price_id: string;
  stripe_subscription_id: string;
  status: SubscriptionStatus;
  subscription_tier: SubscriptionTier;
  billing_period: BillingPeriod;
  billing_plan: BillingPlan;
  end_date: string;
  created_at: string;
  updated_at: string;
}

const redis = new Redis({
  url: Deno.env.get("UPSTASH_REDIS_REST_URL")!,
  token: Deno.env.get("UPSTASH_REDIS_REST_TOKEN")!,
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")! ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")! ?? "",
);

const _invalidateSubscriptionCache = async (userId: string) => {
  try {
    const CACHE_PREFIX = "user_sub:";
    const cacheKey = `${CACHE_PREFIX}${userId}`;

    await redis.del(cacheKey);
  } catch (error) {
    console.error("Cache invalidation error:", error);
  }
};

const _fetchOnGoingSubscriptions = async () => {
  try {
    const { data, error } = await supabase
      .from("user_subscriptions")
      .select("user_id, status, end_date")
      .in("status", [SubscriptionStatus.ACTIVE, SubscriptionStatus.CANCELLED])
      .neq("stripe_price_id", "price_free"); // exclude free plan

    if (error) return { data: null, error };
    return { data, error: null };
  } catch (error) {
    console.error("Error in _fetchOnGoingSubscriptions:", error);
    return { data: null, error };
  }
};

const _downgradeToFreePlan = async (userId: string) => {
  try {
    const { error } = await supabase
      .from("user_subscriptions")
      .update({
        status: "ACTIVE",
        subscription_tier: "FREE",
        stripe_price_id: "price_free",
        billing_plan: null,
        billing_period: null,
        stripe_subscription_id: null,
        end_date: null,
        updated_at: moment().toISOString(),
      })
      .eq("user_id", userId);

    if (error) throw error;
    await _invalidateSubscriptionCache(userId);
  } catch (error) {
    console.error("Error in _downgradeToFreePlan:", error);
    throw error;
  }
};

Deno.serve(async () => {
  console.log("[Cron] Starting subscription update job");

  try {
    const subscriptionsResponse = await _fetchOnGoingSubscriptions();
    if (subscriptionsResponse.error) throw subscriptionsResponse.error;

    console.log(
      `[Cron] Found ${subscriptionsResponse.data.length} subscriptions to process`,
    );

    const updatePromise = subscriptionsResponse.data.map(
      async (subscription: PurchasedSubscription) => {
        const now = moment();
        const endDate = moment(subscription.end_date);
        console.log("Comparing dates:", {
          now: now.format(),
          endDate: endDate.format(),
          isBefore: endDate.isBefore(now),
        });

        if (endDate.isBefore(now)) {
          console.log(
            `[Cron] Processing expired subscription for: ${subscription.user_id}`,
          );
          await _downgradeToFreePlan(subscription.user_id);
          console.log(
            `[Cron] Processed subscription for user: ${subscription.user_id}`,
          );
        }
      },
    );

    await Promise.all(updatePromise);

    return new Response(
      JSON.stringify({
        message: "Subscription update job completed",
        status: 200,
      }),
      { headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error in cron job:", error);
    return new Response(
      JSON.stringify({
        message: "Subscription update cron job failed",
        status: 500,
      }),
      { headers: { "Content-Type": "application/json" } },
    );
  }
});
