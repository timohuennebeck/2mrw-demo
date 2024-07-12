"use server";

import { createSubscriptionTable, createUserTable } from "@/utils/supabase/admin";
import { checkUserExists } from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/server";

export async function signUp(formData: FormData) {
    const supabase = createClient();

    const firstName = formData.get("firstName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
        const existingUser = await checkUserExists({ userEmail: email });

        if (existingUser) {
            return { error: "This email is already in use. Please log in to continue." };
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: firstName,
                },
            },
        });

        if (error) {
            return { error: error.message };
        }

        const { user } = data;

        if (!user) {
            return { error: "User creation failed." };
        }

        await createUserTable({ user });
        await createSubscriptionTable({ userId: user.id });

        return { success: true };
    } catch (err) {
        console.error("Unexpected error during sign up:", err);

        return { error: "There has been an error during sign up." };
    }
}
