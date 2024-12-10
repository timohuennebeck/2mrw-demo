"use server";

import { TextConstants } from "@/constants/TextConstants";
import { SupabaseErrors } from "@/enums";
import { SignUpMethod } from "@/enums/user";
import { createClient } from "@/services/integration/server";
import { AuthError } from "@supabase/supabase-js";

const _updateUserSignUpMethod = async (userId: string, authMethod: SignUpMethod) => {
    const supabase = await createClient();

    const { error } = await supabase
        .from("users")
        .update({
            auth_method: authMethod,
        })
        .eq("id", userId);

    return { data: null, error: error ? error.message : null };
};

export const signUpUserToSupabase = async ({
    firstName,
    email,
    password,
    authMethod,
}: {
    firstName: string;
    email: string;
    password: string;
    authMethod: SignUpMethod;
}) => {
    const supabase = await createClient();

    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: firstName } },
        });

        if (error) return { data: null, error: error.message };

        const updateResult = await _updateUserSignUpMethod(data.user?.id ?? "", authMethod);

        return updateResult.error
            ? { data: null, error: updateResult.error }
            : { data: TextConstants.TEXT__SIGNUP_CONFIRMATION_SENT, error: null };
    } catch (err) {
        return { data: null, error: TextConstants.ERROR__DURING_SIGN_UP };
    }
};

export const resendConfirmationEmail = async (email: string) => {
    const supabase = await createClient();

    try {
        const { error } = await supabase.auth.resend({
            type: "signup",
            email: email,
        });

        if (error) throw error;

        return {
            data: TextConstants.TEXT__CONFIRMATION_EMAIL_SENT,
            error: null,
        };
    } catch (error) {
        const supabaseError = error as AuthError;

        if (supabaseError.code === SupabaseErrors.EMAIL_LIMIT_REACHED) {
            return {
                data: null,
                error: TextConstants.ERROR__EMAIL_LIMIT_REACHED,
            };
        }

        return {
            data: null,
            error: TextConstants.ERROR__FAILED_TO_RESEND_EMAIL,
        };
    }
};
