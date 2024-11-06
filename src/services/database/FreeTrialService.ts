"use server";

import { FreeTrialStatus } from "@/enums/FreeTrialStatus";
import { FreeTrial } from "@/interfaces/FreeTrial";
import moment from "moment";
import { StartUserFreeTrialParams } from "../integration/supabaseInterfaces";
import { checkRowExists } from "./BaseService";
import { handleSupabaseError } from "@/lib/helper/SupabaseHelper";
import { createClient } from "../integration/server";
import { createSupabasePowerUserClient } from "../integration/admin";

export const fetchUserFreeTrial = async (userId: string) => {
    const supabase = createClient();

    try {
        const { rowExists, error: rowCheckError } = await checkRowExists("free_trials", userId);

        if (rowCheckError) throw rowCheckError;

        if (!rowExists) {
            return {
                freeTrial: null,
                error: null,
            };
        }

        const { data: freeTrial, error } = await supabase
            .from("free_trials")
            .select("*")
            .eq("user_id", userId)
            .single();

        if (error) throw error;

        return {
            freeTrial: freeTrial as FreeTrial,
            error: null,
        };
    } catch (error) {
        return {
            freeTrial: null,
            error: handleSupabaseError({ error, fnTitle: "fetchUserFreeTrial" }),
        };
    }
};

export const startUserFreeTrial = async ({
    userId,
    stripePriceId,
    freeTrialEndDate,
}: StartUserFreeTrialParams) => {
    const supabase = createClient();

    try {
        const { error } = await adminSupabase.from("free_trials").insert({
            user_id: userId,
            start_date: moment().toISOString(),
            end_date: moment(freeTrialEndDate).toISOString(),
            stripe_price_id: stripePriceId,
            status: FreeTrialStatus.ACTIVE,
            updated_at: moment().toISOString(),
            created_at: moment().toISOString(),
        });

        if (error) throw error;

        return { success: true, error: null };
    } catch (error) {
        return {
            success: null,
            error: handleSupabaseError({ error, fnTitle: "startUserFreeTrial" }),
        };
    }
};

export const endUserFreeTrial = async (userId: string) => {
    const adminSupabase = await createSupabasePowerUserClient();

    try {
        const { error } = await adminSupabase
            .from("free_trials")
            .update({
                updated_at: moment().toISOString(),
                status: FreeTrialStatus.EXPIRED,
            })
            .eq("user_id", userId);

        await adminSupabase.auth.admin.updateUserById(userId, {
            user_metadata: {
                free_trial_status: FreeTrialStatus.EXPIRED,
            },
        });

        if (error) throw error;

        return { success: true, error: null };
    } catch (error) {
        return {
            success: null,
            error: handleSupabaseError({ error, fnTitle: "endUserFreeTrial" }),
        };
    }
};

export const cancelUserFreeTrial = async (userId: string) => {
    const adminSupabase = await createSupabasePowerUserClient();

    try {
        const { error } = await adminSupabase
            .from("free_trials")
            .update({
                updated_at: moment().toISOString(),
                status: FreeTrialStatus.CANCELLED,
            })
            .eq("user_id", userId);

        await adminSupabase.auth.admin.updateUserById(userId, {
            user_metadata: {
                free_trial_status: FreeTrialStatus.CANCELLED,
            },
        });
        if (error) throw error;

        return { success: true, error: null };
    } catch (error) {
        return {
            success: null,
            error: handleSupabaseError({ error, fnTitle: "cancelUserFreeTrial" }),
        };
    }
};
