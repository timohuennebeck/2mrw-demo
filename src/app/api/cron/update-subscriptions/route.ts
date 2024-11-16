import {
    downgradeUserToFreePlan,
    terminateUserSubscription,
} from "@/services/database/subscriptionService";
import { createSupabasePowerUserClient } from "@/services/integration/admin";
import { SubscriptionStatus } from "@/enums";
import moment from "moment";
import { NextResponse as response } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async () => {
    const adminSupabase = await createSupabasePowerUserClient();

    try {
        const { data: activeSubscriptions, error: fetchError } = await adminSupabase
            .from("user_subscriptions")
            .select("user_id, status, end_date")
            .in("status", [SubscriptionStatus.ACTIVE, SubscriptionStatus.CANCELLED]);

        if (fetchError) throw fetchError;

        const updatePromise = activeSubscriptions.map(async (subscription) => {
            const now = moment();
            const endDate = moment(subscription.end_date);

            if (endDate.isBefore(now)) {
                const { error } = await terminateUserSubscription(subscription.user_id);
                if (error) throw error;

                const { error: updateUserError } = await downgradeUserToFreePlan(
                    subscription.user_id,
                ); // downgrade the user to the free plan as he has not renewed the subscription
                if (updateUserError) throw updateUserError;
            }
        });

        if (updatePromise) {
            await Promise.all(updatePromise);
        }

        return response.json({ success: true });
    } catch (error) {
        return response.json({ success: false, error: error });
    }
};
