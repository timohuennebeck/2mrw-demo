import { SubscriptionStatus } from "@/enums/SubscriptionStatus";
import { endUserSubscription } from "@/services/supabase/admin";
import { createClient } from "@/services/supabase/server";
import moment from "moment";
import { NextResponse as response } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async () => {
    const supabase = createClient();

    try {
        const { data: activeSubscriptions, error: fetchError } = await supabase
            .from("purchased_subscriptions")
            .select("user_id, status, end_date")
            .in("status", [SubscriptionStatus.ACTIVE, SubscriptionStatus.CANCELLED]);

        if (fetchError) throw fetchError;

        const updatePromise = activeSubscriptions.map(async (subscription) => {
            const now = moment();
            const endDate = moment(subscription.end_date);

            if (endDate.isBefore(now)) {
                const { error } = await endUserSubscription(subscription.user_id);
                if (error) throw error;

                await supabase.auth.updateUser({
                    data: {
                        subscription_status: SubscriptionStatus.EXPIRED,
                    },
                });
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
