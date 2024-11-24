"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "./action";
import RegisterLoginForm from "@/components/application/RegisterLoginForm/RegisterLoginForm";
import { TextConstants } from "@/constants/TextConstants";
import { createClient } from "@/services/integration/client";
import { StatusMessage } from "@/interfaces";

const _sendMagicLink = async (email: string) => {
    const supabase = createClient();

    const result = await supabase.auth.signInWithOtp({
        email,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/settings`,
        },
    });
    return result;
};

const SignInPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null);

    const router = useRouter();

    const handleSubmit = async ({ email, password }: { email: string; password: string }) => {
        setIsLoading(true);

        const result = await signIn({ email, password });
        if (result?.success) {
            setStatusMessage({
                type: "info",
                message: TextConstants.TEXT__SIGN_IN_SUCCESSFUL,
            });

            router.replace(result.redirect ?? "/");
        }

        if (result?.error) {
            setStatusMessage({
                type: "error",
                message: result.error,
            });
            setTimeout(() => setStatusMessage(null), 5000);
        }

        setIsLoading(false);
    };

    const loginWithMagicLink = async (email: string) => {
        setIsLoading(true);

        const result = await _sendMagicLink(email);

        if (result.error) {
            setIsLoading(false);
            setStatusMessage({
                type: "error",
                message: result.error.message,
            });
            setTimeout(() => setStatusMessage(null), 5000);
            return;
        }

        setStatusMessage({
            type: "info",
            message: TextConstants.TEXT__MAGIC_LINK_SENT,
        });

        setTimeout(() => {
            setStatusMessage({
                type: "info",
                message: TextConstants.TEXT__DIDNT_RECEIVE_EMAIL,
                action: {
                    label: TextConstants.TEXT__RESEND_EMAIL,
                    onClick: async () => await _sendMagicLink(email),
                },
            });
        }, 4000);
        setIsLoading(false);
    };

    return (
        <RegisterLoginForm
            mode="signin"
            handleSubmit={handleSubmit}
            loginWithMagicLink={loginWithMagicLink}
            isLoading={isLoading}
            statusMessage={statusMessage}
        />
    );
};

export default SignInPage;
