"use server";

import { SignUpMethod } from "@/enums/user";
import { createUserTable } from "@/services/database/userService";
import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse as response } from "next/server";

export const GET = async (request: Request) => {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/";

    /**
     * this route is used when the user logs in via Google
     * he'll be redirected to this route and then have his cookies and token verified
     */

    if (code) {
        const cookieStore = cookies();

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

        if (!error && data.session) {
            const { user: authUser } = data.session;

            try {
                const { error } = await createUserTable(authUser, SignUpMethod.GOOGLE);
                if (error) throw error;

                return response.redirect(`${origin}${next}`);
            } catch (error) {
                console.error("Unexpected error during Google sign in:", error);
                return response.redirect(`${origin}/auth/auth-code-error`);
            }
        }
    }

    return response.redirect(`${origin}/auth/auth-code-error`);
};
