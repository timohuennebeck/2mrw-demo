"use server";

import { TextConstants } from "@/constants/TextConstants";
import { getClients } from "@/services/database/BaseService";

export const sendPasswordResetEmail = async ({ email }: { email: string }) => {
    const { adminSupabase } = await getClients();

    if (!email) {
        return { error: TextConstants.TEXT__PLEASE_ENTER_AN_EMAIL };
    }

    try {
        const { error } = await adminSupabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/update-password`,
        });

        if (error) throw error;

        return { success: TextConstants.TEXT__RESET_PASSWORD_EMAIL_SENT };
    } catch (error) {
        return { error: TextConstants.ERROR__FAILED_TO_SEND_PASSWORD_RESET_EMAIL };
    }
};
