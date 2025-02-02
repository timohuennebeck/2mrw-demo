"use server";

import { TextConstants } from "@/constants/TextConstants";
import { createClient } from "@/services/supabase-clients/server";
import moment from "moment";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

interface SignInParams {
    email: string;
    password: string;
}

export const signIn = async ({ email, password }: SignInParams) => {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        if (error.message === "Invalid login credentials") {
            return { error: TextConstants.TEXT__INVALID_CREDENTIALS };
        }

        return { error: error.message };
    }

    revalidatePath("/app", "layout");
    return { success: true, redirect: "/app" };
};

export const signInUsingGoogle = async (referralCode?: string) => {
    try {
        if (referralCode) {
            const cookieStore = await cookies();
            cookieStore.set("referral_code", referralCode, {
                expires: moment().add(72, "hours").toDate(), // uses cookies for google as we don't have access to the email until signed up
            });
        }

        const supabase = await createClient();

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`, // don't change this as this path is used for authentication
            },
        });

        if (error) {
            return { error: error.message };
        }

        return { success: true, redirect: data.url };
    } catch (error) {
        return {
            error: "There has been an unexpected error signing in to Google",
        };
    }
};
