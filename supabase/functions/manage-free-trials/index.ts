import { createClient } from "npm:@supabase/supabase-js@2.47.8";
import moment from "npm:moment@2.30.1";
import express, { Request, Response } from "npm:express@4.18.2";
import process from "node:process";

export enum SubscriptionTier {
  FREE = "FREE",
  ESSENTIALS = "ESSENTIALS",
  INDIE_HACKER = "INDIE_HACKER",
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

const supabase = createClient(
  process.env.SUPABASE_URL! ?? "",
  process.env.SUPABASE_SERVICE_ROLE_KEY! ?? "",
);

const _fetchOnGoingFreeTrials = async () => {
  try {
    const { data, error } = await supabase
      .from("free_trials")
      .select("*")
      .eq("status", FreeTrialStatus.ACTIVE)
      .lt("end_date", moment().toISOString());

    if (error) return { data: null, error };

    return { data, error: null };
  } catch (error) {
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

    return { success: true, error: null };
  } catch (error) {
    return { success: false, error };
  }
};

const _downgradeToFreePlan = async (userId: string) => {
  try {
    const { error } = await supabase
      .from("subscriptions")
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
    throw error;
  }
};

const app = express();
app.use(express.json());

app.post("/manage-free-trials", async (_req: Request, res: Response) => {
  try {
    const trialsResponse = await _fetchOnGoingFreeTrials();
    if (trialsResponse.error) throw trialsResponse.error;

    if (!trialsResponse.data) {
      return res.status(200).json({
        message: "There are no free trials to process",
        status: 200,
      });
    }

    const processedUsers: string[] = [];

    const updatePromise = trialsResponse.data.map(async (trial: FreeTrial) => {
      const freeTrialUpdateResponse = await _updateFreeTrialToExpired(
        trial.user_id,
      );

      if (freeTrialUpdateResponse.error) throw freeTrialUpdateResponse.error;
      await _downgradeToFreePlan(trial.user_id);

      processedUsers.push(trial.user_id);
    });

    await Promise.all(updatePromise);

    res.status(200).json({
      message: "Free trial update job completed",
      status: 200,
      processedUsers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Free trial update cron job failed" + error,
      status: 500,
      processedUsers: [],
    });
  }
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
