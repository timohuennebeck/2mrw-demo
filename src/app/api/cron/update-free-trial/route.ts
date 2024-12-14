import { FreeTrialStatus } from "@/enums";
import { downgradeToFreePlan } from "@/services/database/subscriptionService";
import { createSupabasePowerUserClient } from "@/services/integration/admin";
import { handleSupabaseError } from "@/utils/errors/supabaseError";
import moment from "moment";
import { NextResponse as nextResponse } from "next/server";

export const dynamic = "force-dynamic";

const _fetchOnGoingFreeTrials = async () => {
    try {
        const adminSupabase = await createSupabasePowerUserClient();

        const { data, error } = await adminSupabase
            .from("free_trials")
            .select("user_id, status, end_date")
            .eq("status", FreeTrialStatus.ACTIVE);

        if (error) return { data: null, error };

        return { data, error: null };
    } catch (error) {
        const supabaseError = handleSupabaseError(error, "_fetchOnGoingFreeTrials");
        return { data: null, error: supabaseError };
    }
};

const _updateFreeTrialToExpired = async (userId: string) => {
    try {
        const adminSupabase = await createSupabasePowerUserClient();

        const { error: updateError } = await adminSupabase
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
        const supabaseError = handleSupabaseError(error, "_updateFreeTrialToExpired");
        return { success: false, error: supabaseError };
    }
};

export const GET = async () => {
    console.log("[Cron] Starting free trial update job");

    try {
        const trialsResponse = await _fetchOnGoingFreeTrials();
        if (trialsResponse.error) throw trialsResponse.error;

        console.log(`[Cron] Found ${trialsResponse.data.length} trials to process`);

        const updatePromise = trialsResponse.data.map(async (trial) => {
            const now = moment();
            const endDate = moment(trial.end_date);

            if (endDate.isBefore(now)) {
                console.log(`[Cron] Processing expired trial for: ${trial.user_id}`);

                const freeTrialUpdateResponse = await _updateFreeTrialToExpired(trial.user_id);
                if (freeTrialUpdateResponse.error) throw freeTrialUpdateResponse.error;

                await downgradeToFreePlan(trial.user_id);

                console.log(`[Cron] Processed trial for user: ${trial.user_id}`);
            }
        });

        await Promise.all(updatePromise);

        return nextResponse.json({ message: "Free trial update job completed", status: 200 });
    } catch (error) {
        return nextResponse.json({ message: "Free trial update cron job failed", status: 500 });
    }
};
