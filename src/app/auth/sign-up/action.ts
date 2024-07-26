"use server";

import { checkUserExists } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";

export async function signUp(formData: FormData) {
    const supabase = createClient();

    const firstName = formData.get("firstName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
        const { user: userExists } = await checkUserExists({ userEmail: email });

        if (userExists) {
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

        return { success: true };
    } catch (err) {
        console.error("Unexpected error during sign up:", err);

        return { error: "There has been an error during sign up." };
    }
}