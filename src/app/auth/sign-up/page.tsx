"use client";

import { useState } from "react";
import { toast } from "sonner";
import RegisterLoginForm from "@/components/RegisterLoginForm";
import { sendConfirmationEmail, signUp } from "./action";
import { TextConstants } from "@/constants/TextConstants";

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
            loading: TextConstants.TEXT__RESENDING_EMAIL,
            success: (result) => {
                setTimeout(() => showResendEmailToast({ email }), 1000);
                return result.success as string;
            },
            error: (err) => err.error ?? TextConstants.ERROR__FAILED_TO_RESEND_EMAIL,
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
            toast.error(TextConstants.ERROR__FIRST_NAME_IS_MISSING);
            return;
        }

        if (email === "") {
            toast.error(TextConstants.ERROR__EMAIL_IS_MISSING);
            return;
        }

        if (password === "") {
            toast.error(TextConstants.ERROR__PASSWORD_IS_MISSING);
            return;
        }

        toastPromise(signUp({ firstName, email, password }), {
            loading: TextConstants.TEXT__SIGNING_UP,
            success: () => {
                setTimeout(() => showResendEmailToast({ email }), 2000);
                return TextConstants.TEXT__SIGN_UP_SUCCESSFUL_CHECK_EMAIL;
            },
            error: (err) => err.error ?? TextConstants.ERROR__UNEXPECTED_ERROR,
        });
    };

    return <RegisterLoginForm mode="signup" handleSubmit={handleSubmit} isLoading={isLoading} />;
};

export default SignUpPage;
