"use server";

import { TextConstants } from "@/constants/TextConstants";
import { SupabaseErrors } from "@/enums/SupabaseErrors";
import { checkEmailExists } from "@/services/database/UserService";
import { createClient } from "@/services/integration/server";
import { AuthError } from "@supabase/supabase-js";

export const signUp = async ({
    firstName,
    email,
    password,
}: {
    firstName: string;
    email: string;
    password: string;
}) => {
    const supabase = createClient();

    try {
        const { emailExists } = await checkEmailExists(email);

        if (emailExists) {
            return { error: TextConstants.ERROR__EMAIL_ALREADY_IN_USE };
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
            return { error: TextConstants.ERROR__USER_CREATION_FAILED };
        }

        return { success: true };
    } catch (err) {
        return { error: TextConstants.ERRROR__DURING_SIGN_UP };
    }
};

export const sendConfirmationEmail = async ({ email }: { email: string }) => {
    const supabase = createClient();

    if (!email) {
        return { error: TextConstants.ERROR__EMAIL_IS_MISSING };
    }

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
