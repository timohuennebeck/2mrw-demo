"use client";

import { useState } from "react";
import { toast } from "sonner";
import RegisterLoginForm from "@/components/RegisterLoginForm";
import { sendConfirmationEmail, signUp } from "./action";

interface PromiseResult {
    success?: boolean | string;
    error?: string;
}

interface ToastMessages {
    loading: string;
    success: (result: PromiseResult) => string;
    error: (error: PromiseResult) => string;
}

const SignUpPage = () => {
    const [isLoading, setIsLoading] = useState(false);

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
    const toastPromise = (promise: Promise<PromiseResult>, messages: ToastMessages) => {
        setIsLoading(true);
        return toast.promise(promise, {
            loading: messages.loading,
            success: (result: PromiseResult) => {
                if (result.success) {
                    return messages.success(result);
                }
                throw result;
            },
            error: (err: PromiseResult) => messages.error(err),
            finally: () => setIsLoading(false),
        });
    };

    const handleResendEmail = async (email: string) => {
        const resendPromise = sendConfirmationEmail({ email });

        toastPromise(resendPromise, {
            loading: "Resending email...",
            success: (result) => {
                setTimeout(() => showResendEmailToast({ email }), 1000);
                return result.success as string;
            },
            error: (err) => err.error ?? "Failed to resend email.",
        });
    };

    const handleSubmit = async ({
        email,
        password,
        firstName,
    }: {
        email: string;
        password: string;
        firstName: string;
    }) => {
        if (firstName === "") {
            toast.error("Username is missing.");
            return;
        }

        if (email === "") {
            toast.error("Email is missing.");
            return;
        }

        if (password === "") {
            toast.error("Password is missing.");
            return;
        }

        toastPromise(signUp({ firstName, email, password }), {
            loading: "Signing up...",
            success: () => {
                setTimeout(() => showResendEmailToast({ email }), 2000);
                return "Sign up successful! Please check email inbox.";
            },
            error: (err) => err.error ?? "Unexpected error has occured.",
        });
    };

    return <RegisterLoginForm mode="signup" handleSubmit={handleSubmit} isLoading={isLoading} />;
};

export default SignUpPage;
