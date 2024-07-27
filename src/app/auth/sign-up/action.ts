"use server";

import { checkUserEmailExists } from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/server";

export const signUp = async (formData: FormData) => {
    const supabase = createClient();

    const firstName = formData.get("firstName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
        const { emailExists } = await checkUserEmailExists({ userEmail: email });

        if (emailExists) {
            return { error: "This email is in use. Please log in to continue." };
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
};
