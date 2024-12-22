"use server";

import { TextConstants } from "@/constants/TextConstants";
import { createClient } from "../integration/server";
import { AuthMethod } from "@/enums/user";

export const sendMagicLink = async (email: string) => {
    try {
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
