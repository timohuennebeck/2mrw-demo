import { createClient } from "npm:@supabase/supabase-js";
import moment from "npm:moment";
import { Redis } from "npm:@upstash/redis";

export enum SubscriptionTier {
  FREE = "FREE",
  ESSENTIALS = "ESSENTIALS",
  FOUNDERS = "FOUNDERS",
}

export enum FreeTrialStatus {
  ACTIVE = "ACTIVE",
  CONVERTED = "CONVERTED",
  CANCELLED = "CANCELLED",
  EXPIRED = "EXPIRED",
}

export enum SubscriptionStatus {
  ACTIVE = "ACTIVE",
  TRIALING = "TRIALING",
  CANCELLED = "CANCELLED",
  EXPIRED = "EXPIRED",
}

export interface FreeTrial {
  id: string;
  user_id: string;
  subscription_tier: SubscriptionTier;
  stripe_subscription_id: string;
  status: FreeTrialStatus;
  start_date: string;
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

const _invalidateFreeTrialCache = async (userId: string) => {
  try {
    const CACHE_PREFIX = "user_trial:";
    const cacheKey = `${CACHE_PREFIX}${userId}`;

    await redis.del(cacheKey);
  } catch (error) {
    console.error("Cache invalidation error:", error);
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

const _fetchOnGoingFreeTrials = async () => {
  try {
    const { data, error } = await supabase
      .from("free_trials")
      .select("user_id, status, end_date")
      .eq("status", FreeTrialStatus.ACTIVE);

    if (error) return { data: null, error };

    return { data, error: null };
  } catch (error) {
    console.error("Error in _fetchOnGoingFreeTrials:", error);
    return { data: null, error };
  }
};

const _updateFreeTrialToExpired = async (userId: string) => {
  try {
    const { error: updateError } = await supabase
      .from("free_trials")
      .update({
        status: FreeTrialStatus.EXPIRED,
        end_date: moment().toISOString(),
        updated_at: moment().toISOString(),
      })
      .eq("user_id", userId);

    if (updateError) return { success: false, error: updateError };

    await _invalidateFreeTrialCache(userId);

    return { success: true, error: null };
  } catch (error) {
    console.error("Error in _updateFreeTrialToExpired:", error);
    return { success: false, error };
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

    await _invalidateSubscriptionCache(userId);
  } catch (error) {
    console.error("Error in _downgradeToFreePlan:", error);
    throw error;
  }
};

Deno.serve(async () => {
  console.log("[Cron] Starting free trial update job");

  try {
    const trialsResponse = await _fetchOnGoingFreeTrials();
    if (trialsResponse.error) throw trialsResponse.error;

    console.log(`[Cron] Found ${trialsResponse.data.length} trials to process`);

    const updatePromise = trialsResponse.data.map(async (trial: FreeTrial) => {
      const now = moment();
      const endDate = moment(trial.end_date);

      if (endDate.isBefore(now)) {
        console.log(`[Cron] Processing expired trial for: ${trial.user_id}`);

        const freeTrialUpdateResponse = await _updateFreeTrialToExpired(
          trial.user_id,
        );

        if (freeTrialUpdateResponse.error) throw freeTrialUpdateResponse.error;

        await _downgradeToFreePlan(trial.user_id);

        console.log(`[Cron] Processed trial for user: ${trial.user_id}`);
      }
    });

    await Promise.all(updatePromise);

    return new Response(
      JSON.stringify({
        message: "Free trial update job completed",
        status: 200,
      }),
      { headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error in cron job:", error);
    return new Response(
      JSON.stringify({
        message: "Free trial update cron job failed",
        status: 500,
      }),
      { headers: { "Content-Type": "application/json" } },
    );
  }
});
