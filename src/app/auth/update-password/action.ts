"use server";

import { createClient } from "@/services/supabase/server";
import { redirect } from "next/navigation";

type UpdatePasswordProps = {
    password: string;
    confirmPassword: string;
};

export const updatePassword = async ({ password, confirmPassword }: UpdatePasswordProps) => {
    const supabase = createClient();

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
