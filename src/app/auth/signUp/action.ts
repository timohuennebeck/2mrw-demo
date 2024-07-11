"use server";

import { createClient } from "@/utils/supabase/server";

export async function signUp(formData: FormData) {
    const supabase = createClient();

    const firstName = formData.get("firstName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { data: existingUser } = await supabase
        .from("users")
        .select("email")
        .eq("email", email)
        .single();

    if (existingUser) {
        return { error: "This email is already in use. Please log in to continue." };
    }

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                first_name: firstName,
            },
        },
    });

    if (error) {
        return { error: error.message };
    }

    return { success: true };
}
