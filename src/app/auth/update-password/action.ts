"use server";

import { TextConstants } from "@/constants/TextConstants";
import { createSupabasePowerUserClient } from "@/services/integration/admin";
import { revalidatePath } from "next/cache";

interface UpdatePasswordProps {
    password: string;
    authCode: string;
}

export const updatePassword = async ({ password, authCode }: UpdatePasswordProps) => {
    const adminSupabase = await createSupabasePowerUserClient();

    try {
        const { error: exchangeError } = await adminSupabase.auth.exchangeCodeForSession(authCode);

        const { error } = await adminSupabase.auth.updateUser({ password });

        if (error || exchangeError) throw error;

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
