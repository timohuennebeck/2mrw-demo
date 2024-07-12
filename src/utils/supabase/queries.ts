import { createClient } from "./client";

const supabase = createClient();

export const checkUserExists = async ({ userEmail }: { userEmail: string }) => {
    try {
        const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("email", userEmail)
            .single();

        if (error) {
            if (error.code === "PGRST116") {
                // means that no match was found
                return null;
            }

            // triggered when some other error occurs
            throw error;
        }

        return data;
    } catch (error) {
        console.error("Error checking user existence:", error);
        throw error;
    }
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
                return null;
            }

            // triggered when some other error occurs
            throw error;
        }

        return data;
    } catch (error) {
        console.error("Error checking subscription status:", error);
        throw error;
    }
};
