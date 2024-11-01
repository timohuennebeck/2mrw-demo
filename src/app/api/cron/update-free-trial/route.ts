import { FreeTrialStatus } from "@/enums/FreeTrialStatus";
import { endUserFreeTrial } from "@/services/supabase/admin";
import { createClient } from "@/services/supabase/server";
import moment from "moment";
import { NextResponse as response } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async () => {
    const supabase = createClient();

    try {
        const { data: activeTrials, error: fetchError } = await supabase
            .from("free_trials")
            .select("user_id, status, end_date")
            .in("status", [FreeTrialStatus.ACTIVE, FreeTrialStatus.CANCELLED]);

        if (fetchError) throw fetchError;

        const now = moment();
        const updatePromise = activeTrials.map(async (trial) => {
            const endDate = moment(trial.end_date);

            if (endDate.isBefore(now)) {
                const { error } = await endUserFreeTrial({ userId: trial.user_id });
                if (error) throw error;

                await supabase.auth.updateUser({
                    data: {
                        free_trial_status: FreeTrialStatus.EXPIRED,
                    },
                });
            }
        });

        if (updatePromise.length) {
            await Promise.all(updatePromise);
        }

        return response.json({ success: true });
    } catch (error) {
        return response.json({ success: false, error: error });
    }
};
