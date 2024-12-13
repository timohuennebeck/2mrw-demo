"use server";

import { TextConstants } from "@/constants/TextConstants";
import { createClient } from "../integration/server";
import { AuthMethod } from "@/enums/user";
import { EmailType } from "@/enums";
import { sendLoopsTransactionalEmail } from "../loops/loopsService";

export const sendMagicLink = async (email: string) => {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
            data: {
                auth_method: AuthMethod.MAGIC_LINK,
            },
        },
    });

    if (error) return { data: null, error };

    return { data: TextConstants.TEXT__MAGIC_LINK_SENT, error: null };
};
