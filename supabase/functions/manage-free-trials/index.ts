import { createClient } from "npm:@supabase/supabase-js@2.47.8";
import moment from "npm:moment@2.30.1";
import express, { Request, Response } from "npm:express@4.18.2";
import process from "node:process";

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

const supabase = createClient(
  process.env.SUPABASE_URL! ?? "",
  process.env.SUPABASE_SERVICE_ROLE_KEY! ?? "",
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
        "Authorization": `Bearer ${process.env.LOOPS_API_KEY}`,
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

const _fetchUserEmail = async (userId: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("email")
    .eq("id", userId);

  return { email: data?.[0]?.email, error };
};

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
    console.error("Error in _fetchOnGoingFreeTrials:", error);
    return { data: null, error };
  }
};

const _updateFreeTrialToExpired = async (userId: string) => {
  try {
    console.log("→ [LOG] Downgrading to free plan for user:", userId);

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
    console.error("Error in _updateFreeTrialToExpired:", error);
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
    console.error("Error in _downgradeToFreePlan:", error);
    throw error;
  }
};

const app = express();
app.use(express.json());

app.post("/manage-free-trials", async (_req: Request, res: Response) => {
  console.log("[Cron] Starting free trial update job");

  try {
    const trialsResponse = await _fetchOnGoingFreeTrials();
    if (trialsResponse.error) throw trialsResponse.error;

    if (!trialsResponse.data) {
      return res.status(200).json({
        message: "There are no free trials to process",
        status: 200,
      });
    }

    console.log(`[Cron] Found ${trialsResponse.data.length} trials to process`);

    const processedUsers: string[] = [];

    const updatePromise = trialsResponse.data.map(async (trial: FreeTrial) => {
      console.log(`[Cron] Processing expired trial for: ${trial.user_id}`);

      const freeTrialUpdateResponse = await _updateFreeTrialToExpired(
        trial.user_id,
      );

      if (freeTrialUpdateResponse.error) throw freeTrialUpdateResponse.error;

      await _downgradeToFreePlan(trial.user_id);

      const { email } = await _fetchUserEmail(trial.user_id);

      await _sendLoopsEmail(email, "YOUR_TRANSACTIONAL_ID", {
        upgradeUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/choose-pricing-plan`,
      }); // sends user has been downgraded to free plan email

      processedUsers.push(trial.user_id);

      console.log(`[Cron] Processed trial for user: ${trial.user_id}`);
    });

    await Promise.all(updatePromise);

    res.status(200).json({
      message: "Free trial update job completed",
      status: 200,
      processedUsers,
    });
  } catch (error) {
    console.error("Error in cron job:", error);

    res.status(500).json({
      message: "Free trial update cron job failed",
      status: 500,
      processedUsers: [],
    });
  }
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
