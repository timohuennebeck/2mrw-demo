"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/services/integration/server";
import { TextConstants } from "@/constants/TextConstants";

export const signIn = async ({ email, password }: { email: string; password: string }) => {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        if (error.message === "Invalid login credentials") {
            return { error: TextConstants.TEXT__INVALID_CREDENTIALS };
        }

        return { error: error.message };
    }

    revalidatePath("/app", "layout");
    return { success: true, redirect: "/app" };
};

export const signInUsingGoogle = async () => {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`, // don't change this as this path is used for authentication
            },
        });

        if (error) {
            return { error: error.message };
        }

        return { success: true, redirect: data.url };
    } catch (error) {
        return { error: "There has been an unexpected error signing in to Google" };
    }
};
