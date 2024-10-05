"use client";

import { useState } from "react";
import { toast } from "sonner";
import RegisterLoginForm from "@/components/RegisterLoginForm";
import { useRouter } from "next/navigation";
import { sendConfirmationEmail, signUp } from "./action";

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
            error: (err: { error: string }) => {
                return "Failed to resend email.";
            },
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
            success: (result: { success: boolean; error: string }) => {
                if (result.success) {
                    setTimeout(() => showResendEmailToast({ email }), 2000);

                    return "Sign up successful! Please check email inbox.";
                }

                throw new Error(result.error);
            },
            error: (err: Error) => {
                return err.message;
            },
        });
    };

    return <RegisterLoginForm mode="signup" handleSubmit={handleSubmit} isLoading={isLoading} />;
};

export default SignUpPage;
