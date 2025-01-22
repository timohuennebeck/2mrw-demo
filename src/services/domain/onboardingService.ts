import { createClient } from "@/services/integration/client";

export const fetchClaimedRewards = async (userId: string) => {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("onboarding_rewards")
        .select("task_id")
        .eq("user_id", userId);

    if (error) return { data: [] as string[], error };

    return {
        data: data.map((reward) => reward.task_id) as string[],
        error: null,
    };
};

export const claimReward = async (userId: string, taskId: string) => {
    const supabase = createClient();

    const { error: rewardError } = await supabase
        .from("onboarding_rewards")
        .insert({ user_id: userId, task_id: taskId });

    if (rewardError) return { success: false, error: rewardError };

    /**
     * FYI: This is where you need to add the logic to update the reward the user has earned, e.g. earning tokens, getting one month of premium, etc.
     */

    return { success: true };
};
