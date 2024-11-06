"use server";

import { TextConstants } from "@/constants/TextConstants";
import { createClient } from "@/services/integration/server";
import { revalidatePath } from "next/cache";

interface UpdatePasswordProps {
    password: string;
    authCode: string;
}

export const updatePassword = async ({ password, authCode }: UpdatePasswordProps) => {
    const supabase = await createClient();

    try {
        /**
         * requires the exchangeCodeForSession to be called first
         * to verify the auth code that was sent to him via the reset password email
         */

        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(authCode);
        if (exchangeError) throw exchangeError;

        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;

        revalidatePath("/", "layout");
        return { success: true, redirect: "/" };
    } catch (err) {
        if (err instanceof Error) {
            return { error: err.message };
        } else {
            return { error: TextConstants.ERROR__UNEXPECTED_ERROR };
        }
    }
};
