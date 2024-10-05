"use server";

import { checkUserEmailExists } from "@/services/supabase/queries";
import { createClient } from "@/services/supabase/server";

export const signUp = async ({
    name,
    email,
    password,
}: {
    name: string;
    email: string;
    password: string;
}) => {
    const supabase = createClient();

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
                    full_name: name,
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

export const sendConfirmationEmail = async ({ email }: { email: string }) => {
    const supabase = createClient();

    if (!email) {
        return { error: "Email address is missing" };
    }

    try {
        const { error } = await supabase.auth.resend({
            type: "signup",
            email: email,
        });

        if (error) throw error;

        return { success: "Confirmation email has been sent" };
    } catch (error) {
        return { error: "Failed to resend confirmation email" };
    }
};
