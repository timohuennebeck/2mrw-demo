"use server";

import { isFreePlanEnabled } from "@/config";
import { processReferralSignup } from "@/services/database/referral-service";
import { startFreePlan } from "@/services/database/subscription-service";
import { createUserTable, fetchUser } from "@/services/database/user-service";
import { createClient } from "@/services/supabase-clients/server";
import { stripe } from "@/services/stripe/client";
import { getStripeCustomerId } from "@/services/stripe/stripe-customer";
import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { type NextRequest, NextResponse } from "next/server";

const _updateUserEmail = async (userId: string, email: string) => {
    const supabase = await createClient();

    const { error: supabaseError } = await supabase
        .from("users")
        .update({ email })
        .eq("id", userId);

    if (supabaseError) {
        console.error("Failed to update user email:", supabaseError);
        return redirect("/auth-status/error?mode=email-update");
    }

    await _updateUserEmailInStripe(email);
};

const _updateUserEmailInStripe = async (email: string) => {
    const { stripeCustomerId } = await getStripeCustomerId();

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
            return redirect("/auth-status/error?mode=token-expired");
        }

        const {
            data: { session },
        } = await supabase.auth.getSession();
        const authUser = data.user;

        switch (type) {
            case "recovery": {
                const urlToRedirectTo =
                    `/auth/update-password?access_token=${session?.access_token}&refresh_token=${session?.refresh_token}`;
                return redirect(urlToRedirectTo);
            }
            case "email":
            case "signup": {
                const { data: userExists } = await fetchUser(
                    authUser?.id ?? "",
                );

                if (!userExists && authUser) {
                    const authMethod = authUser.user_metadata.auth_method;

                    const { error } = await createUserTable(
                        authUser,
                        authMethod,
                    ); // if the user does not exist in the database, create a new user

                    if (error) {
                        return redirect("/auth-status/error?mode=create-user");
                    }

                    await processReferralSignup({
                        newUserId: authUser.id,
                        newUserEmail: authUser.email!,
                    });

                    if (isFreePlanEnabled()) {
                        await startFreePlan(authUser.id);
                    }

                    return redirect(
                        "/auth-status/success?mode=email-confirmed",
                    );
                }

                return NextResponse.next();
            }

            case "magiclink": {
                return NextResponse.next(); // no additional action needed and just redirect the user after verifying the magic link
            }

            case "email_change": {
                await _updateUserEmail(
                    authUser?.id ?? "",
                    authUser?.email ?? "",
                );
                return redirect("/user-profile?message=email-updated");
            }

            default:
                return NextResponse.json({ error: "Invalid type" }, {
                    status: 400,
                });
        }
    }
};
