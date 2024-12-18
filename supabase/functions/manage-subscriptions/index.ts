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

const _sendLoopsEmail = async (
  email: string,
  transactionalId: string,
  variables: { upgradeUrl: string },
) => {
  try {
    const response = await fetch("https://app.loops.so/api/v1/transactional", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${Deno.env.get("LOOPS_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transactionalId,
        email,
        dataVariables: variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send email: ${response.statusText}`);
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Error sending Loops email:", error);
    return { success: false, error };
  }
};

const _invalidateSubscriptionCache = async (userId: string) => {
  try {
    const CACHE_PREFIX = "user_sub:";
    const cacheKey = `${CACHE_PREFIX}${userId}`;

    await redis.del(cacheKey);
  } catch (error) {
    console.error("Cache invalidation error:", error);
  }
};

const _fetchUserEmail = async (userId: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("email")
    .eq("id", userId);

  return { email: data?.[0]?.email, error };
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
        status: SubscriptionStatus.ACTIVE,
        subscription_tier: SubscriptionTier.FREE,
        stripe_price_id: "price_free",
        billing_plan: null,
        billing_period: null,
        stripe_subscription_id: null,
        end_date: null,
        updated_at: moment().toISOString(),
      })
      .eq("user_id", userId);

    if (error) throw error;
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

        if (endDate.isBefore(now)) {
          console.log(
            `[Cron] Processing expired subscription for: ${subscription.user_id}`,
          );
          await _downgradeToFreePlan(subscription.user_id);
          await _invalidateSubscriptionCache(subscription.user_id);

          const { email } = await _fetchUserEmail(subscription.user_id);

          await _sendLoopsEmail(email, "cm4u8hrjp03c9tv164dc8jy4r", {
            upgradeUrl: `${Deno.env.get("NEXT_PUBLIC_SITE_URL")}/choose-pricing-plan`,
          }); // sends user has been downgraded to free plan email

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
