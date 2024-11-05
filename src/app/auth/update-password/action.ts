"use server";

import { TextConstants } from "@/constants/TextConstants";
import { getClients } from "@/services/database/BaseService";
import { revalidatePath } from "next/cache";

interface UpdatePasswordProps {
    password: string;
    authCode: string;
}

export const updatePassword = async ({ password, authCode }: UpdatePasswordProps) => {
    const { supabase } = await getClients();

    try {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(authCode);

        const { error } = await supabase.auth.updateUser({ password });

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
