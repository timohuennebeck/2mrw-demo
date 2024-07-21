import { Subscription } from "@/interfaces/Subscription";
import { createClient } from "./client";
import { FreeTrial } from "@/interfaces/FreeTrial";
import { FreeTrialStatus } from "@/app/enums/FreeTrialStatus";

const supabase = createClient();

export const checkUserExists = async ({ userEmail }: { userEmail: string }) => {
    const { data: existingUser } = await supabase
        .from("users")
        .select("*")
        .eq("email", userEmail)
        .single();

    return existingUser;
};

export const checkSubscriptionStatus = async ({ userId }: { userId: string }) => {
    try {
        const { data, error } = await supabase
            .from("subscriptions")
            .select("*")
            .eq("user_id", userId)
            .single();

        if (error) {
            if (error.code === "PGRST116") {
                // means that no match was found
                return { subscription: null, error: null };
            }

            // triggered when some other error occurs
            throw error;
        }

        return { subscription: data as Subscription, error: null };
    } catch (error) {
        console.error("Unexpected error checking subscription status:", error);
        return { subscription: null, error: error as Error };
    }
};

export const checkFreeTrialStatus = async ({ userId }: { userId: string }) => {
    try {
        const { data, error } = await supabase
            .from("free_trials")
            .select("*")
            .eq("user_id", userId)
            .single();

        if (error) {
            if (error.code === "PGRST116") {
                // no free trial found for the user
                return { status: FreeTrialStatus.NOT_STARTED, freeTrial: null, error: null };
            }
            throw error;
        }

        const freeTrial = data as FreeTrial;
        const now = new Date();
        const startDate = new Date(freeTrial.start_date);
        const endDate = new Date(freeTrial.end_date);

        if (now < startDate) {
            return { status: FreeTrialStatus.NOT_STARTED, freeTrial, error: null };
        } else if (now >= startDate && now <= endDate) {
            return { status: FreeTrialStatus.ACTIVE, freeTrial, error: null };
        } else {
            return { status: FreeTrialStatus.EXPIRED, freeTrial, error: null };
        }
    } catch (error) {
        console.error("Unexpected error checking free trial status:", error);
        return { status: FreeTrialStatus.ERROR, error: error as Error };
    }
};
