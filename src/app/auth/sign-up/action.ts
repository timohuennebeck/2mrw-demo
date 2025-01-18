"use server";

import { TextConstants } from "@/constants/TextConstants";
import { SupabaseErrors } from "@/enums";
import { AuthMethod } from "@/enums/user";
import { createClient } from "@/services/integration/server";
import { AuthError } from "@supabase/supabase-js";
import moment from "moment";
import { cookies } from "next/headers";

export const signUpUserToSupabase = async ({
    firstName,
    email,
    password,
    authMethod,
    referralCode,
}: {
    firstName: string;
    email: string;
    password: string;
    authMethod: AuthMethod;
    referralCode?: string | null;
}) => {
    try {
        if (referralCode) {
            const cookieStore = await cookies();
            cookieStore.set("referral_code", referralCode, {
                expires: moment().add(72, "hours").toDate(),
            });
        }

        const supabase = await createClient();

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: firstName,
                    auth_method: authMethod,
                },
            },
        });

        if (error) return { data: null, error: error.message };

        return {
            data: TextConstants.TEXT__SIGNUP_CONFIRMATION_SENT,
            error: null,
        };
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
