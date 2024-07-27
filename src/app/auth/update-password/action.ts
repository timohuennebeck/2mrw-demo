"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const updatePassword = async (formData: FormData) => {
    const supabase = createClient();
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
        return { error: "Passwords do not match" };
    }

    try {
        const { error } = await supabase.auth.updateUser({ password });

        if (error) throw error;

        redirect("/");
    } catch (err) {
        if (err instanceof Error) {
            return { error: err.message };
        } else {
            return { error: "There has been an unexpected error." };
        }
    }
};
