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

        if (error) return { data: null, error };

        return { data: TextConstants.TEXT__MAGIC_LINK_SENT, error: null };
    } catch (error) {
        console.error("Error sending magic link:", error);
        return { data: null, error: TextConstants.ERROR__UNEXPECTED_ERROR };
    }
};
