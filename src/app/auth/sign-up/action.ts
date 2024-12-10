"use server";

import { TextConstants } from "@/constants/TextConstants";
import { SupabaseErrors } from "@/enums";
import { SignUpMethod } from "@/enums/user";
import { createClient } from "@/services/integration/server";
import { AuthError } from "@supabase/supabase-js";

const _updateUserSignUpMethod = async (userId: string, authMethod: SignUpMethod) => {
    const supabase = await createClient();

    const { error: dbError } = await supabase
        .from("users")
        .update({
            auth_method: authMethod,
        })
        .eq("id", userId);

    if (dbError) return { error: TextConstants.ERROR__USER_CREATION_FAILED };

    return { success: true };
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
            options: {
                data: {
                    full_name: firstName,
                },
            },
        });

        if (error) return { error: error.message };

        const updateResult = await _updateUserSignUpMethod(data.user?.id ?? "", authMethod);

        return updateResult.error
            ? { success: false, error: updateResult.error }
            : { success: true, error: null };
    } catch (err) {
        return { success: false, error: TextConstants.ERROR__DURING_SIGN_UP };
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

        return { success: true, message: TextConstants.TEXT__CONFIRMATION_EMAIL_SENT };
    } catch (error) {
        const supabaseError = error as AuthError;

        if (supabaseError.code === SupabaseErrors.EMAIL_LIMIT_REACHED) {
            return {
                success: false,
                error: TextConstants.ERROR__EMAIL_LIMIT_REACHED,
            };
        }

        return {
            success: false,
            error: TextConstants.ERROR__FAILED_TO_RESEND_EMAIL,
        };
    }
};
