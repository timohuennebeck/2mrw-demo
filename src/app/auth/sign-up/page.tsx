"use client";

import { useState } from "react";
import RegisterLoginForm from "@/components/application/RegisterLoginForm";
import { resendConfirmationEmail, signUpUserToSupabase } from "./action";
import { TextConstants } from "@/constants/TextConstants";
import { checkUserEmailExists } from "@/services/database/userService";
import { StatusMessage } from "@/interfaces";
import { useSearchParams } from "next/navigation";
import { AuthMethod } from "@/enums/user";
import { sendMagicLink } from "@/services/domain/authService";

interface HandleSubmitParams {
    firstName: string;
    email: string;
    password: string;
}

const _getSignUpMethod = (searchParams: URLSearchParams) => {
    const signUpMethod = searchParams.get("method");
    return signUpMethod === "magic-link" ? AuthMethod.MAGIC_LINK : AuthMethod.PASSWORD;
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
                message: result.data ?? "",
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

    const _handleEmailConfirmation = ({
        message,
        onClick,
    }: {
        message: string;
        onClick: () => void;
    }) => {
        setStatusMessage({
            type: "info",
            message,
        });

        setTimeout(() => {
            setStatusMessage({
                type: "info",
                message: TextConstants.TEXT__DIDNT_RECEIVE_EMAIL,
                action: {
                    label: TextConstants.TEXT__RESEND_EMAIL,
                    onClick: onClick,
                },
            });
        }, 4000);
    };

    const handleSubmit = async ({ firstName, email, password }: HandleSubmitParams) => {
        setIsLoading(true);

        try {
            const { data } = await checkUserEmailExists(email);
            if (data) throw new Error(data); // throws an error because the email exists

            const dataToUpdate = {
                firstName,
                email,
                password,
                authMethod: _getSignUpMethod(searchParams),
            };

            const result = await signUpUserToSupabase(dataToUpdate);
            if (result.error) throw result.error;

            _handleEmailConfirmation({
                message: result.data ?? "",
                onClick: async () => await _handleResendConfirmationEmail(email),
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

    const handleSignUpWithMagicLink = async (email: string) => {
        setIsLoading(true);

        try {
            const result = await sendMagicLink(email);

            if (result.error) throw result.error;

            _handleEmailConfirmation({
                message: result.data ?? "",
                onClick: async () => await sendMagicLink(email),
            });
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
            mode="signup"
            handleSubmit={handleSubmit}
            loginOrSignupWithMagicLink={handleSignUpWithMagicLink}
            isLoading={isLoading}
            statusMessage={statusMessage}
        />
    );
};

export default SignUpPage;
