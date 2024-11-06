"use server";

import { TextConstants } from "@/constants/TextConstants";
import { createClient } from "@/services/integration/server";

export const sendPasswordResetEmail = async ({ email }: { email: string }) => {
    const supabase = await createClient();

    if (!email) {
        return { error: TextConstants.TEXT__PLEASE_ENTER_AN_EMAIL };
    }

    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/update-password`,
        });

        if (error) throw error;

        return { success: TextConstants.TEXT__RESET_PASSWORD_EMAIL_SENT };
    } catch (error) {
        return { error: TextConstants.ERROR__FAILED_TO_SEND_PASSWORD_RESET_EMAIL };
    }
};
