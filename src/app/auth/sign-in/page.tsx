"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "./action";
import RegisterLoginForm from "@/components/application/RegisterLoginForm";
import { TextConstants } from "@/constants/TextConstants";
import { StatusMessage } from "@/interfaces";
import { sendMagicLink } from "@/services/domain/authService";

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

            router.replace(result.redirect ?? "/dashboard");
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

    const handleLoginWithMagicLink = async (email: string) => {
        setIsLoading(true);

        try {
            const result = await sendMagicLink(email);
            if (result.error) throw result.error;

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
                        onClick: async () => await sendMagicLink(email),
                    },
                });
            }, 4000);
        } catch (error) {
            setStatusMessage({
                type: "error",
                message: error instanceof Error ? error.message : "Unexpected error occurred",
            });
            setTimeout(() => setStatusMessage(null), 4000);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <RegisterLoginForm
            mode="signin"
            handleSubmit={handleSubmit}
            loginOrSignupWithMagicLink={handleLoginWithMagicLink}
            isLoading={isLoading}
            statusMessage={statusMessage}
        />
    );
};

export default SignInPage;
