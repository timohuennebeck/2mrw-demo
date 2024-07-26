import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import axios from "axios";
import { createPurchasedSubscriptionTable, createUserTable } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
    // this route is used for email authentication when the user needs to confirm their email via email

    const { searchParams } = new URL(request.url);
    const token_hash = searchParams.get("token_hash");
    const type = searchParams.get("type") as EmailOtpType | null;
    const next = searchParams.get("next") ?? "/";

    const supabase = createClient();

    if (token_hash && type) {
        const { data, error } = await supabase.auth.verifyOtp({
            type,
            token_hash,
        });

        if (!error) {
            try {
                const user = data.user;

                if (user) {
                    await createUserTable({ supabase, user });

                    await createPurchasedSubscriptionTable({ supabase, userId: user.id });

                    await axios.post(`${process.env.NEXT_PUBLIC_SITE_URL}/api/sendUserFreeTrialEmail`, {
                        userEmail: user.user_metadata.email ?? "",
                        userFullName: user.user_metadata.full_name ?? "",
                    });
                } else {
                    console.error("User data not available");
                }
            } catch (emailError) {
                console.error("Error sending free trial email:", emailError);
            }

            return redirect(next);
        }
    }

    redirect("/error");
}
