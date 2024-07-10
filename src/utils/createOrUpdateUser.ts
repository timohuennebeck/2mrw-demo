import { StripePriceId } from "@/config/subscriptionPlans";
import { checkUserExists } from "./supabase/queries";
import { createUserInSupabase, updateExistingUserInSupabase } from "./supabase/admin";

export const createOrUpdateUser = async ({
    userFullName,
    userEmail,
    stripePriceId,
}: {
    userFullName: string;
    userEmail: string;
    stripePriceId: StripePriceId;
}) => {
    try {
        const user = await checkUserExists({ userEmail });

        if (user) {
            await updateExistingUserInSupabase({
                userId: user.id,
                stripePriceId,
            });
        } else {
            await createUserInSupabase({
                userFullName,
                userEmail,
                stripePriceId,
            });
        }
    } catch (error) {
        console.error(`Error handling user ${userEmail}:`, error);
    }
};
