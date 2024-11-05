"use server";

import { getClients } from "@/services/database/BaseService";
import { revalidatePath } from "next/cache";

export const signIn = async ({ email, password }: { email: string; password: string }) => {
    const { supabase } = await getClients();

    const { error } = await supabase.auth.signInWithPassword({
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
    const { supabase } = await getClients();

    const { data, error } = await supabase.auth.signInWithOAuth({
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
