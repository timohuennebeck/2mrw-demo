"use client";

import { useState } from "react";
import RegisterLoginForm from "@/components/application/RegisterLoginForm";
import { resendConfirmationEmail, signUpUserToSupabase } from "./action";
import { TextConstants } from "@/constants/TextConstants";
import { checkUserEmailExists } from "@/services/database/userService";
import { StatusMessage } from "@/interfaces";
import { useSearchParams } from "next/navigation";
import { SignUpMethod } from "@/enums/user";

interface HandleSubmitParams {
    firstName: string;
    email: string;
    password: string;
}

const _getSignUpMethod = (searchParams: URLSearchParams) => {
    const signUpMethod = searchParams.get("method");
    return signUpMethod === "magic-link" ? SignUpMethod.MAGIC_LINK : SignUpMethod.PASSWORD;
};

const SignUpPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null);

    const searchParams = useSearchParams();

    const _handleResendConfirmationEmail = async (email: string) => {
        setIsLoading(true);

        try {
            const result = await resendConfirmationEmail(email);
            if (result.error) throw result.error;

            setStatusMessage({
                type: "info",
                message: result.message ?? "",
            });
        } catch (error) {
            setStatusMessage({
                type: "error",
                message: error instanceof Error ? error.message : "Unexpected error occurred",
            });
        } finally {
            setIsLoading(false);
            setTimeout(() => setStatusMessage(null), 5000);
        }
    };

    const _handleEmailConfirmation = (email: string) => {
        setStatusMessage({
            type: "info",
            message: TextConstants.TEXT__SIGNUP_CONFIRMATION_SENT,
        });

        setTimeout(() => {
            setStatusMessage({
                type: "info",
                message: TextConstants.TEXT__DIDNT_RECEIVE_EMAIL,
                action: {
                    label: TextConstants.TEXT__RESEND_EMAIL,
                    onClick: () => _handleResendConfirmationEmail(email),
                },
            });
        }, 4000);
    };

    const handleSubmit = async ({ firstName, email, password }: HandleSubmitParams) => {
        setIsLoading(true);

        try {
            const { emailExists } = await checkUserEmailExists(email);
            if (emailExists) throw new Error(TextConstants.ERROR__EMAIL_ALREADY_IN_USE);

            const dataToUpdate = {
                firstName,
                email,
                password,
                authMethod: _getSignUpMethod(searchParams),
            };

            const result = await signUpUserToSupabase(dataToUpdate);
            if (result.error) throw result.error;

            _handleEmailConfirmation(email);
        } catch (error) {
            setStatusMessage({
                type: "error",
                message: error instanceof Error ? error.message : "Unexpected error occurred",
            });
        } finally {
            setIsLoading(false);
            setTimeout(() => setStatusMessage(null), 5000);
        }
    };

    return (
        <RegisterLoginForm
            mode="signup"
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            statusMessage={statusMessage}
        />
    );
};

export default SignUpPage;
