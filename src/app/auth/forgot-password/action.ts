"use server";

import { createClient } from "@/services/supabase/server";

export const sendResetEmail = async (formData: FormData) => {
    const supabase = createClient();

    const email = formData.get("email") as string;

    if (!email) {
        return { error: "Please enter an email address" };
    }

    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/update-password`,
        });

        if (error) throw error;

        return { success: "Password reset email has been sent" };
    } catch (error) {
        return { error: "Failed to send password reset email" };
    }
};
