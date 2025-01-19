import { createClient } from "npm:@supabase/supabase-js@2.47.8";
import moment from "npm:moment@2.30.1";
import express, { Request, Response } from "npm:express@4.18.2";
import process from "node:process";

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

const _fetchOnGoingSubscriptions = async () => {
  try {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .in("status", [SubscriptionStatus.ACTIVE, SubscriptionStatus.CANCELLED])
      .neq("stripe_price_id", "price_free") // exclude free plan
      .lt("end_date", moment().toISOString());

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

app.post("/manage-subscriptions", async (_req: Request, res: Response) => {
  console.log("[Cron] Starting subscription update job");

  try {
    const subscriptionsResponse = await _fetchOnGoingSubscriptions();
    if (subscriptionsResponse.error) throw subscriptionsResponse.error;

    if (!subscriptionsResponse.data) {
      return res.status(200).json({
        message: "There are no subscriptions to process",
        status: 200,
        processedUsers: [],
      });
    }

    console.log(
      `[Cron] Found ${subscriptionsResponse?.data?.length} subscriptions to process`,
    );

    const processedUsers: string[] = [];

    const updatePromise = subscriptionsResponse.data.map(
      async (subscription: PurchasedSubscription) => {
        console.log(
          `[Cron] Processing expired subscription for: ${subscription.user_id}`,
        );
        await _downgradeToFreePlan(subscription.user_id);

        const { email } = await _fetchUserEmail(subscription.user_id);

        await _sendLoopsEmail(email, "YOUR_TRANSACTIONAL_ID", {
          upgradeUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/choose-pricing-plan`,
        }); // sends user has been downgraded to free plan email

        processedUsers.push(subscription.user_id);

        console.log(
          `[Cron] Processed subscription for user: ${subscription.user_id}`,
        );
      },
    );

    await Promise.all(updatePromise);

    res.status(200).json({
      message: "Subscription update job completed",
      status: 200,
      processedUsers,
    });
  } catch (error) {
    console.error("Error in cron job:", error);

    res.status(500).json({
      message: "Subscription update cron job failed",
      status: 500,
      processedUsers: [],
    });
  }
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
