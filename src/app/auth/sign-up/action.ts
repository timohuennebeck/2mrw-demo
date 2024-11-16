"use server";

import { TextConstants } from "@/constants/TextConstants";
import { createClient } from "@/services/integration/server";
import { SupabaseErrors } from "@/interfaces";
import { AuthError } from "@supabase/supabase-js";

export const signUpUserToSupabase = async ({
    firstName,
    email,
    password,
}: {
    firstName: string;
    email: string;
    password: string;
}) => {
    const supabase = await createClient();

    try {
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
            return { error: TextConstants.ERROR__USER_CREATION_FAILED };
        }

        return { success: true, error: null };
    } catch (err) {
        return { success: false, error: TextConstants.ERROR__DURING_SIGN_UP };
    }
};

export const sendConfirmationEmail = async (email: string) => {
    const supabase = await createClient();

    try {
        const { error } = await supabase.auth.resend({
            type: "signup",
            email: email,
        });

        if (error) throw error;

        return { success: TextConstants.TEXT__CONFIRMATION_EMAIL_SENT };
    } catch (error) {
        const supabaseError = error as AuthError;

        if (supabaseError.code === SupabaseErrors.EMAIL_LIMIT_REACHED) {
            return { error: TextConstants.ERROR__EMAIL_LIMIT_REACHED };
        }

        return { error: TextConstants.ERROR__FAILED_TO_RESEND_EMAIL };
    }
};
