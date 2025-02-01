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
  INDIE_HACKER = "INDIE_HACKER",
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
    throw error;
  }
};

const app = express();
app.use(express.json());

app.post("/manage-subscriptions", async (_req: Request, res: Response) => {
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

    const processedUsers: string[] = [];

    const updatePromise = subscriptionsResponse.data.map(
      async (subscription: PurchasedSubscription) => {
        await _downgradeToFreePlan(subscription.user_id);

        processedUsers.push(subscription.user_id);
      },
    );

    await Promise.all(updatePromise);

    res.status(200).json({
      message: "Subscription update job completed",
      status: 200,
      processedUsers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Subscription update cron job failed: " + error,
      status: 500,
      processedUsers: [],
    });
  }
});

app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
