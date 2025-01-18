"use server";

import { TextConstants } from "@/constants/TextConstants";
import { createClient } from "../integration/server";
import { AuthMethod } from "@/enums/user";
import moment from "moment";
import { cookies } from "next/headers";

export const sendMagicLink = async (email: string, referralCode?: string) => {
    try {
        if (referralCode) {
            const cookieStore = await cookies(); // referral_code is only present when the user is signing up
            cookieStore.set("referral_code", referralCode, {
                expires: moment().add(72, "hours").toDate(),
            });
        }

        const supabase = await createClient();

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                data: {
                    auth_method: AuthMethod.MAGIC_LINK,
                },
            },
        });

        if (error) return { success: false, error };

        return { success: true, error: null };
    } catch (error) {
        console.error("Error sending magic link:", error);
        return { success: false, error: TextConstants.ERROR__UNEXPECTED_ERROR };
    }
};
