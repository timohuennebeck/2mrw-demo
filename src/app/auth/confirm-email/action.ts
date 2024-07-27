"use server";

import { createClient } from "@/lib/supabase/server";

export const sendConfirmationEmail = async (formData: FormData) => {
    const supabase = createClient();

    const email = formData.get("email") as string;

    if (!email) {
        return { error: "Email address is missing" };
    }

    try {
        const { error } = await supabase.auth.resend({
            type: "signup",
            email: email,
        });

        if (error) throw error;

        return { success: "Confirmation email has been sent" };
    } catch (error) {
        return { error: "Failed to resend confirmation email" };
    }
};
