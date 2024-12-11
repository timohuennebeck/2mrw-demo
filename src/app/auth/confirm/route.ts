"use server";

import { AuthMethod } from "@/enums/user";
import { createUserTable, fetchUser } from "@/services/database/userService";
import { createClient } from "@/services/integration/server";
import { stripe } from "@/services/stripe/client";
import { getStripeCustomerId } from "@/services/stripe/stripeCustomer";
import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { NextResponse as nextResponse, type NextRequest } from "next/server";

const _updateUserEmail = async (userId: string, email: string) => {
    const supabase = await createClient();

    const { error: supabaseError } = await supabase
        .from("users")
        .update({ email })
        .eq("id", userId);

    if (supabaseError) {
        console.error("Failed to update user email:", supabaseError);
        return redirect("/auth-error?type=email-update");
    }

    await _updateUserEmailInStripe(email);
};

const _updateUserEmailInStripe = async (email: string) => {
    const stripeCustomerId = await getStripeCustomerId();

    if (stripeCustomerId) {
        await stripe.customers.update(stripeCustomerId, {
            email,
        });
    }
};

export const GET = async (request: NextRequest) => {
    /**
     * this route is used for the following scenarios when clicking on the confirmation link in the user's email:
     * - signup authentication (type: "signup")
     * - magic link authentication (type: "magiclink")
     * - email change authentication (type: "email_change")
     * - password reset authentication (type: "recovery")
     */

    const { searchParams } = new URL(request.url);
    const token_hash = searchParams.get("token_hash");
    const type = searchParams.get("type") as EmailOtpType | null;

    if (token_hash && type) {
        const supabase = await createClient();

        const { data, error } = await supabase.auth.verifyOtp({
            type,
            token_hash,
        });

        if (error) {
            return redirect("/auth-error?type=token-expired");
        }

        const {
            data: { session },
        } = await supabase.auth.getSession();
        const authUser = data.user;

        switch (type) {
            case "recovery": {
                const urlToRedirectTo = `/auth/update-password?access_token=${session?.access_token}&refresh_token=${session?.refresh_token}`;
                return redirect(urlToRedirectTo);
            }
            case "email":
            case "signup": {
                const supabaseUser = await fetchUser(authUser?.id ?? "");

                if (supabaseUser.user) {
                    return redirect("/dashboard"); // user already exists in Supabase, redirect and don't create a new user
                }

                if (authUser) {
                    const authMethod = authUser.user_metadata.auth_method as AuthMethod;
                    const { error } = await createUserTable(authUser, authMethod);

                    if (error) {
                        console.error("Failed to create user:", error);
                        return redirect("/auth-error?type=create-user");
                    }

                    return redirect("/auth/email-confirmation");
                }
            }

            case "magiclink": {
                return redirect("/dashboard"); // no additional action needed and just redirect the user after verifying the magic link
            }

            case "email_change": {
                await _updateUserEmail(authUser?.id ?? "", authUser?.email ?? "");
                return redirect("/user-profile?message=email-updated");
            }

            default:
                return nextResponse.json({ error: "Invalid type" }, { status: 400 });
        }
    }
};
