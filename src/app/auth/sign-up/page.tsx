"use client";

import { Suspense, useState } from "react";
import RegisterLoginForm from "@/components/application/register-login-form";
import { resendConfirmationEmail, signUpUserToSupabase } from "./action";
import { TextConstants } from "@/constants/TextConstants";
import { checkUserEmailExists } from "@/services/database/user-service";
import { StatusMessage } from "@/interfaces";
import { AuthMethod } from "@/enums/user.enum";
import { sendMagicLink } from "@/services/domain/auth-service";
import { appConfig } from "@/config";
import { useParamFeedback } from "@/hooks/use-param-feedback";
import { useSearchParams } from "next/navigation";

interface HandleSubmitParams {
    email: string;
    password: string;
    referralCode?: string;
}

const _getSignUpMethod = (searchParams: URLSearchParams) => {
    const signUpMethod = searchParams.get("method");
    return signUpMethod === "magic-link" ? AuthMethod.MAGIC_LINK : AuthMethod.PASSWORD;
};

const SignUpPage = () => (
    <Suspense fallback={null}>
        <SignUpPageContent />
    </Suspense>
);

const SignUpPageContent = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null);

    const searchParams = useSearchParams();

    useParamFeedback(setStatusMessage, {
        param: "account-deleted",
        type: "info",
        message: "Your account has been deleted! Tell us how we could do better next time.",
        duration: 0, // won't auto-clear
        action: {
            label: "Share Feedback",
            onClick: () => window.open(appConfig.feedback.forms.accountDeletion.formUrl, "_blank"),
        },
        configKey: "accountDeletion",
    });

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

    const handleSubmit = async ({ email, password, referralCode }: HandleSubmitParams) => {
        setIsLoading(true);

        try {
            const { emailExists } = await checkUserEmailExists(email);
            if (emailExists) throw new Error(TextConstants.ERROR__EMAIL_ALREADY_IN_USE); // throws an error because the email exists

            const dataToUpdate = {
                email,
                password,
                authMethod: _getSignUpMethod(searchParams),
                referralCode,
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

    const handleSignUpWithMagicLink = async (email: string, referralCode?: string) => {
        setIsLoading(true);

        try {
            const result = await sendMagicLink(email, referralCode);

            if (result.error) throw result.error;

            _handleEmailConfirmation({
                message: TextConstants.TEXT__MAGIC_LINK_SENT,
                onClick: async () => await _handleResendConfirmationEmail(email),
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
            setStatusMessage={setStatusMessage}
        />
    );
};

export default SignUpPage;
