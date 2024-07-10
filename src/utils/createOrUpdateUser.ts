import { StripePriceId } from "@/config/subscriptionPlans";
import { checkUserExists } from "./supabase/queries";
import { createUserInSupabase, updateExistingUserInSupabase } from "./supabase/admin";

export const createOrUpdateUser = async (customerEmail: string, stripePriceId: StripePriceId) => {
    try {
        const user = await checkUserExists({ userEmail: customerEmail });

        if (user) {
            await updateExistingUserInSupabase({
                userId: user.id,
                stripePriceId,
            });
        } else {
            await createUserInSupabase({
                userEmail: customerEmail,
                stripePriceId,
            });
        }
    } catch (error) {
        console.error(`Error handling user ${customerEmail}:`, error);
    }
};
