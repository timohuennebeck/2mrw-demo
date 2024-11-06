"use server";

import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";
import { redirect } from "next/navigation";
import { createUserTable } from "@/services/database/UserService";
import { createClient } from "@/services/integration/server";

export const GET = async (request: NextRequest) => {
    /**
     * this route is used for email authentication
     * the user will be redirected to this route after clicking on the confirmation link in their email
     */

    const { searchParams } = new URL(request.url);
    const token_hash = searchParams.get("token_hash");
    const type = searchParams.get("type") as EmailOtpType | null;
    const next = searchParams.get("next") ?? "/";

    if (token_hash && type) {
        const supabase = await createClient();

        const { data, error } = await supabase.auth.verifyOtp({
            type,
            token_hash,
        });

        if (!error) {
            try {
                const authUser = data.user;

                if (authUser) {
                    await createUserTable(authUser);
                } else {
                    console.error("authUser data not available");
                }
            } catch (error) {
                console.error("Error verifying OTP:", error);
            }

            return redirect(next);
        }
    }

    redirect("/error");
};
