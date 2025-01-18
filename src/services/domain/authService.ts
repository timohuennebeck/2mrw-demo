"use server";

import { TextConstants } from "@/constants/TextConstants";
import { AuthMethod } from "@/enums/user";
import { storePendingReferral } from "../database/referralService";
import { createClient } from "../integration/server";

export const sendMagicLink = async (email: string, referralCode?: string) => {
    try {
        if (referralCode) {
            await storePendingReferral(email, referralCode);
        }

        const supabase = await createClient();

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                data: {
                    auth_method: AuthMethod.MAGIC_LINK,
                },
            },
        });

        if (error) return { success: false, error };

        return { success: true, error: null };
    } catch (error) {
        console.error("Error sending magic link:", error);
        return { success: false, error: TextConstants.ERROR__UNEXPECTED_ERROR };
    }
};
