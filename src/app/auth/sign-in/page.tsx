"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signIn } from "./action";
import RegisterLoginForm from "@/components/RegisterLoginForm";
import { TextConstants } from "@/constants/TextConstants";
import { createClient } from "@/services/integration/client";

const SignInPage = () => {
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const supabase = createClient();

    const handleSubmit = async ({ email, password }: { email: string; password: string }) => {
        setIsLoading(true);

        if (email === "") {
            toast.error(TextConstants.ERROR__EMAIL_IS_MISSING);
            setIsLoading(false);
            return;
        }

        if (password === "") {
            toast.error(TextConstants.ERROR__PASSWORD_IS_MISSING);
            setIsLoading(false);
            return;
        }

        toast.promise(signIn({ email, password }), {
            loading: TextConstants.TEXT__SIGNING_IN,
            success: (result) => {
                if (result.success) {
                    setIsLoading(false);
                    router.replace(result.redirect ?? "/");
                    return TextConstants.TEXT__SIGN_IN_SUCCESSFUL;
                }
                throw new Error(result.error);
            },
            error: (err) => {
                setIsLoading(false);
                return err.message;
            },
        });
    };

    const loginWithMagicLink = async (email: string) => {
        setIsLoading(true);

        if (email === "") {
            toast.error(TextConstants.ERROR__EMAIL_IS_MISSING);
            setIsLoading(false);
            return;
        }

        if (!email.includes("@")) {
            toast.error(TextConstants.ERROR__INVALID_EMAIL);
            setIsLoading(false);
            return;
        }

        toast.promise(
            supabase.auth.signInWithOtp({
                email,
                options: {
                    shouldCreateUser: true, // set this to false if you do not want the user to be automatically signed up
                    emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/settings`,
                },
            }),
            {
                loading: TextConstants.TEXT__SENDING,
                success: () => {
                    setIsLoading(false);
                    return TextConstants.TEXT__MAGIC_LINK_SENT;
                },
                error: (err) => {
                    setIsLoading(false);
                    return err.message;
                },
            },
        );
    };

    return (
        <RegisterLoginForm
            mode="signin"
            handleSubmit={handleSubmit}
            loginWithMagicLink={loginWithMagicLink}
            isLoading={isLoading}
        />
    );
};

export default SignInPage;
