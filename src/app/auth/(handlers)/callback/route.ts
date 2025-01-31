"use server";

import { isFreePlanEnabled, ROUTES_CONFIG } from "@/config";
import { EmailType } from "@/enums";
import { AuthMethod } from "@/enums/user";
import { processReferralSignup } from "@/services/database/referralService";
import { startFreePlan } from "@/services/database/subscriptionService";
import {
    checkUserEmailExists,
    createUserTable,
} from "@/services/database/userService";
import { sendLoopsTransactionalEmail } from "@/services/loops/loopsService";
import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const GET = async (request: Request) => {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");

    /**
     * this route is used when the user logs in via Google
     * he'll be redirected to this route and then have his cookies and token verified
     */

    if (code) {
        const cookieStore = await cookies();

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value;
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        cookieStore.set({ name, value, ...options });
                    },
                    remove(name: string, options: CookieOptions) {
                        cookieStore.delete({ name, ...options });
                    },
                },
            },
        );

        const { data, error } = await supabase.auth.exchangeCodeForSession(
            code,
        );
        if (error) {
            const baseUrl = `${origin}${ROUTES_CONFIG.PUBLIC.STATUS_ERROR}`;
            return redirect(`${baseUrl}?mode=google-auth`);
        }

        const { user: authUser } = data.session;
        const { emailExists } = await checkUserEmailExists(authUser.email!);

        if (!emailExists) {
            const { error } = await createUserTable(
                authUser,
                AuthMethod.GOOGLE,
            );
            if (error) {
                const baseUrl = `${origin}${ROUTES_CONFIG.PUBLIC.STATUS_ERROR}`;
                return redirect(`${baseUrl}?mode=create-user`);
            }

            const cookiesStore = await cookies();
            const referralCode = cookiesStore.get("referral_code");

            if (referralCode) {
                await processReferralSignup({
                    newUserId: authUser.id,
                    newUserEmail: authUser.email!,
                    referralCode: referralCode?.value,
                });

                cookiesStore.delete("referral_code");
            }

            if (isFreePlanEnabled()) {
                await startFreePlan(authUser.id);
            }

            const baseUrl = `${origin}${ROUTES_CONFIG.PUBLIC.STATUS_SUCCESS}`;
            return redirect(`${baseUrl}?mode=google-connected`);
        }

        return redirect(`${origin}${ROUTES_CONFIG.PROTECTED.USER_DASHBOARD}`);
    }
};
