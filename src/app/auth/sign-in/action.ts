"use server";

import { revalidatePath } from "next/cache";
import { createSupabasePowerUserClient } from "@/services/integration/admin";
export const signIn = async ({ email, password }: { email: string; password: string }) => {
    const adminSupabase = await createSupabasePowerUserClient();

    const { error } = await adminSupabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/", "layout");
    return { success: true, redirect: "/" };
};

export const signInUsingGoogle = async () => {
    const adminSupabase = await createSupabasePowerUserClient();

    const { data, error } = await adminSupabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        },
    });

    if (error) {
        return { error: error.message };
    }

    return { success: true, redirect: data.url };
};
