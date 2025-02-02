"use server";

import { TextConstants } from "@/constants/TextConstants";
import { SupabaseErrors } from "@/enums";
import { AuthMethod } from "@/enums/user.enum";
import {
    createPendingReferral,
    getReferrerByReferralCode,
} from "@/services/database/referral-service";
import { createClient } from "@/services/integration/server";
import { AuthError } from "@supabase/supabase-js";

interface SignUpUserToSupabaseParams {
    email: string;
    password: string;
    authMethod: AuthMethod;
    referralCode?: string;
}

export const signUpUserToSupabase = async ({
    email,
    password,
    authMethod,
    referralCode,
}: SignUpUserToSupabaseParams) => {
    try {
        if (referralCode) {
            const { referrer } = await getReferrerByReferralCode(referralCode);
            if (referrer) await createPendingReferral(email, referrer.id);
        }

        const supabase = await createClient();

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
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
