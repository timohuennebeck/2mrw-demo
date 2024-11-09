"use server";

import { TextConstants } from "@/constants/TextConstants";
import { createClient } from "@/services/integration/server";
import { revalidatePath } from "next/cache";

interface UpdatePasswordParams {
    password: string;
    accessToken: string;
    refreshToken: string;
}

export const updatePassword = async ({
    password,
    accessToken,
    refreshToken,
}: UpdatePasswordParams) => {
    const supabase = await createClient();

    try {
        /**
         * requires the access_token and refresh_token to create a new session for authentication as we are not logged in
         * we get the access_token and refresh_token from the confirm route when the user clicks on the confirm link in the password reset email
         */

        await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
        });

        const { error: updateError } = await supabase.auth.updateUser({
            password,
        });

        if (updateError) throw updateError;

        revalidatePath("/", "layout");
        return { success: true, redirect: "/" };
    } catch (err) {
        if (err instanceof Error) {
            return { error: err.message };
        } else {
            return { error: TextConstants.ERROR__UNEXPECTED_ERROR };
        }
    }
};
