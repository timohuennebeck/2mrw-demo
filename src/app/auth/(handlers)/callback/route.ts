"use server";

import { isFreePlanEnabled, ROUTES_CONFIG } from "@/config";
import { EmailType } from "@/enums";
import { AuthMethod } from "@/enums/user";
import { startFreePlan } from "@/services/database/subscriptionService";
import { checkUserEmailExists, createUserTable } from "@/services/database/userService";
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

        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) return redirect(`${origin}${ROUTES_CONFIG.PUBLIC.STATUS_ERROR}?mode=google-auth`);

        const { user: authUser } = data.session;
        const { emailExists } = await checkUserEmailExists(authUser.email!);

        if (!emailExists) {
            const { error } = await createUserTable(authUser, AuthMethod.GOOGLE);
            if (error) return redirect(`${origin}${ROUTES_CONFIG.PUBLIC.STATUS_ERROR}?mode=create-user`);

            if (isFreePlanEnabled()) {
                await startFreePlan(authUser.id);
            }

            sendLoopsTransactionalEmail({
                type: EmailType.WELCOME_TO_SAAS_NAME,
                email: authUser.email!,
                variables: {},
            });

            return redirect(`${origin}${ROUTES_CONFIG.PUBLIC.STATUS_SUCCESS}?mode=google-connected`);
        }

        return redirect(`${origin}${ROUTES_CONFIG.PROTECTED.USER_DASHBOARD}`);
    }
};
