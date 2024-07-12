"use server";

import { createUserTable, createSubscriptionTable } from "@/utils/supabase/admin";
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

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                first_name: firstName,
            },
        },
    });

    const { user } = data;

    await createUserTable({
        userEmail: user?.email ?? "",
        userFullName: user?.user_metadata?.first_name ?? "",
        userId: user?.id ?? "",
    });

    await createSubscriptionTable({ userId: user?.id ?? "" });

    if (error) {
        return { error: error.message };
    }

    return { success: true };
}
