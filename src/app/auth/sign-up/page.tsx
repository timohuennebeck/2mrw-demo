"use client";

import { useState } from "react";
import { toast } from "sonner";
import RegisterLoginForm from "@/components/RegisterLoginForm";
import { useRouter } from "next/navigation";
import { sendConfirmationEmail, signUp } from "./action";

const SignUpPage = () => {
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const showResendEmailToast = ({ email }: { email: string }) => {
        return toast("Didn't receive the email?", {
            duration: 45000,
            action: {
                label: "Resend email",
                onClick: () => handleResendEmail(email),
            },
        });
    };

    // TODO: add types for toastPromise
    const toastPromise = (promise, messages) => {
        setIsLoading(true);
        return toast.promise(promise, {
            ...messages,
            finally: () => setIsLoading(false),
        });
    };

    const handleResendEmail = async (email: string) => {
        const resendPromise = sendConfirmationEmail({ email });
        toastPromise(resendPromise, {
            loading: "Resending email...",
            success: (result: { success: boolean }) => {
                if (result.success) {
                    setTimeout(() => showResendEmailToast({ email }), 1000);
                    return result.success;
                }
            },
            error: "Failed to resend email.",
        });
    };

    const handleSubmit = async ({
        email,
        password,
        name,
    }: {
        email: string;
        password: string;
        name: string;
    }) => {
        if (email === "") {
            toast.error("Email is missing!");
            return;
        }

        toastPromise(signUp({ name, email, password }), {
            loading: "Signing up...",
            success: (result: { success: boolean }) => {
                if (result.success) {
                    router.push(`/auth/sign-up?email=${encodeURIComponent(email)}`);
                    setTimeout(() => showResendEmailToast({ email }), 2000);

                    return "Sign up successful! Please check email inbox.";
                }
            },
            error: "There has been an error during sign up.",
        });
    };

    return <RegisterLoginForm mode="signup" handleSubmit={handleSubmit} isLoading={isLoading} />;
};

export default SignUpPage;
