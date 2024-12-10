"use server";

import { TextConstants } from "@/constants/TextConstants";
import { createClient } from "../integration/server";

export const sendMagicLink = async (email: string) => {
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
        },
    });

    if (error) return { data: null, error };

    return { data: TextConstants.TEXT__MAGIC_LINK_SENT, error: null };
};
