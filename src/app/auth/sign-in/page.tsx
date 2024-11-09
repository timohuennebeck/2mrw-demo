"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "./action";
import RegisterLoginForm from "@/components/RegisterLoginForm";
import { TextConstants } from "@/constants/TextConstants";
import { createClient } from "@/services/integration/client";

interface StatusMessage {
    type: "error" | "info";
    message: string;
}

const SignInPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleSubmit = async ({ email, password }: { email: string; password: string }) => {
        setIsLoading(true);
        const result = await signIn({ email, password });

        if (result?.success) {
            setStatusMessage({
                type: "info",
                message: TextConstants.TEXT__SIGN_IN_SUCCESSFUL,
            });
            setTimeout(() => setStatusMessage(null), 5000);

            setIsLoading(false);
            router.replace(result.redirect ?? "/");
        }

        if (result?.error) {
            setStatusMessage({
                type: "error",
                message: result.error,
            });
            setTimeout(() => setStatusMessage(null), 5000);
            setIsLoading(false);
        }
    };

    const loginWithMagicLink = async (email: string) => {
        setIsLoading(true);

        await supabase.auth.signInWithOtp({
            email,
            options: {
                shouldCreateUser: true, // set this to false if you do not want the user to be automatically signed up
                emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/settings`,
            },
        });
        setIsLoading(false);

        setStatusMessage({
            type: "info",
            message: TextConstants.TEXT__MAGIC_LINK_SENT,
        });
        setTimeout(() => setStatusMessage(null), 5000);
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
