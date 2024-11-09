"use client";

import { useState } from "react";
import RegisterLoginForm from "@/components/RegisterLoginForm";
import { sendConfirmationEmail, signUpUserToSupabase } from "./action";
import { TextConstants } from "@/constants/TextConstants";
import { StatusMessage } from "@/interfaces/FormStatusInterface";
import { checkUserEmailExists } from "@/services/database/UserService";

interface HandleSubmitParams {
    firstName: string;
    email: string;
    password: string;
}

const SignUpPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null);

    const handleSendConfirmationEmail = async (email: string) => {
        setIsLoading(true);
        const result = await sendConfirmationEmail({ email });

        if (result.success) {
            setStatusMessage({
                type: "info",
                message: result.success,
            });
        }

        if (result.error) {
            setStatusMessage({
                type: "error",
                message: result.error,
            });
            setTimeout(() => setStatusMessage(null), 5000);
        }

        setIsLoading(false);
    };

    const handleSubmit = async ({ firstName, email, password }: HandleSubmitParams) => {
        setIsLoading(true);

        const { emailExists } = await checkUserEmailExists(email);
        if (emailExists) {
            setIsLoading(false);
            setStatusMessage({
                type: "error",
                message: TextConstants.ERROR__EMAIL_ALREADY_IN_USE,
            });
            setTimeout(() => setStatusMessage(null), 5000);
            return;
        }

        const result = await signUpUserToSupabase({ firstName, email, password });
        if (result.success) {
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
                        onClick: () => handleSendConfirmationEmail(email),
                    },
                });
            }, 4000);
        }

        if (result.error) {
            setStatusMessage({
                type: "error",
                message: result.error,
            });
            setTimeout(() => setStatusMessage(null), 5000);
        }

        setIsLoading(false);
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
