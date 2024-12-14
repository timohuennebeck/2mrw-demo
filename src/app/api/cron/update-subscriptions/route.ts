import { SubscriptionStatus } from "@/enums";
import { downgradeUserToFreePlan } from "@/services/database/subscriptionService";
import { createSupabasePowerUserClient } from "@/services/integration/admin";
import { handleSupabaseError } from "@/utils/errors/supabaseError";
import moment from "moment";
import { NextResponse as nextResponse } from "next/server";

export const dynamic = "force-dynamic";

const _fetchOnGoingSubscriptions = async () => {
    try {
        const adminSupabase = await createSupabasePowerUserClient();

        const { data, error } = await adminSupabase
            .from("user_subscriptions")
            .select("user_id, status, end_date")
            .in("status", [SubscriptionStatus.ACTIVE, SubscriptionStatus.CANCELLED]);

        if (error) return { data: null, error };

        return { data, error: null };
    } catch (error) {
        const supabaseError = handleSupabaseError(error, "_fetchOnGoingSubscriptions");
        return { data: null, error: supabaseError };
    }
};

export const GET = async () => {
    console.log("[Cron] Starting subscription update job");

    try {
        const subscriptionsResponse = await _fetchOnGoingSubscriptions();
        if (subscriptionsResponse.error) throw subscriptionsResponse.error;

        console.log(`[Cron] Found ${subscriptionsResponse.data.length} subscriptions to process`);

        const updatePromise = subscriptionsResponse.data.map(async (subscription) => {
            const now = moment();
            const endDate = moment(subscription.end_date);

            if (endDate.isBefore(now)) {
                console.log(`[Cron] Processing expired subscription for : ${subscription.user_id}`);

                const downgradeResponse = await downgradeUserToFreePlan(subscription.user_id);
                if (downgradeResponse.error) throw downgradeResponse.error;

                console.log(`[Cron] Processed subscription for user: ${subscription.user_id}`);
            }
        });

        await Promise.all(updatePromise);

        return nextResponse.json({ message: "Subscription update job completed", status: 200 });
    } catch (error) {
        return nextResponse.json({ message: "Subscription update cron job failed", status: 500 });
    }
};
