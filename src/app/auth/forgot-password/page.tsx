"use client";

import InputField from "@/components/InputField";
import Link from "next/link";
import { useState } from "react";
import { sendPasswordResetEmail } from "./action";
import Image from "next/image";
import CustomButton from "@/components/CustomButton";
import { TextConstants } from "@/constants/TextConstants";
import { validateEmailFormat } from "@/lib/validation/validateEmailFormat";
import FormStatusMessage from "@/components/FormStatusMessage";
import { createClient } from "@/services/integration/client";
import { StatusMessage } from "@/interfaces/FormStatusInterface";
import { checkUserEmailExists } from "@/services/database/UserService";

const ForgotPasswordPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({
        email: "",
    });
    const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null);

    const checkFormInput = () => {
        const newErrors = {
            email: "",
        };

        if (email === "") {
            newErrors.email = TextConstants.ERROR__EMAIL_IS_MISSING;
        } else if (!validateEmailFormat(email)) {
            newErrors.email = TextConstants.ERROR__INVALID_EMAIL;
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some((error) => error !== "");
    };

    const handleFormSubmit = async () => {
        if (!checkFormInput()) return;

        setIsLoading(true);
        const { emailExists } = await checkUserEmailExists(email);
        if (!emailExists) {
            setIsLoading(false);
            setStatusMessage({
                type: "error",
                message: TextConstants.TEXT__USER_DOES_NOT_EXIST,
            });
            setTimeout(() => setStatusMessage(null), 5000);
            return;
        }

        const result = await sendPasswordResetEmail({ email });

        if (result.success) {
            setIsLoading(false);
            setStatusMessage({
                type: "info",
                message: result.success,
            });
            setTimeout(() => setStatusMessage(null), 5000);
            return;
        }

        if (result.error) {
            setIsLoading(false);
            setStatusMessage({
                type: "error",
                message: result.error,
            });
            setTimeout(() => setStatusMessage(null), 5000);
        }
    };

    return (
        <div className="flex h-full items-center justify-center">
            <div className="mx-auto flex w-[448px] flex-col gap-4 rounded-md border p-8 lg:mx-0">
                <div className="mb-4 flex items-center gap-2">
                    <Image
                        src="https://framerusercontent.com/images/XmxX3Fws7IH91jzhxBjAhC9CrPM.svg"
                        alt="logo"
                        width={40}
                        height={40}
                    />
                </div>

                <div className="grid gap-2">
                    <h1 className="text-2xl font-medium">Forgot Password</h1>
                    <p className="text-sm text-neutral-400">
                        {TextConstants.TEXT__ENTER_EMAIL_BELOW}
                    </p>
                </div>

                <FormStatusMessage
                    message={statusMessage?.message ?? ""}
                    type={statusMessage?.type}
                    action={statusMessage?.action}
                />

                <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                    <InputField
                        label="Email"
                        id="email"
                        type="email"
                        name="email"
                        placeholder={TextConstants.TEXT__EMAIL_PLACEHOLDER}
                        value={email}
                        onChange={(value) => {
                            setEmail(value);
                            setErrors((prev) => ({ ...prev, email: "" }));
                        }}
                        error={errors.email}
                        hasError={!!errors.email}
                    />

                    <CustomButton
                        title={TextConstants.TEXT__SEND_RESET_LINK}
                        disabled={isLoading}
                        onClick={handleFormSubmit}
                        isLoading={isLoading}
                    />
                </form>

                <p className="mt-4 text-center text-sm">
                    {TextConstants.TEXT__REMEMBER_PASSWORD}{" "}
                    <Link href="/auth/sign-in" className="underline">
                        {TextConstants.TEXT__SIGN_IN}
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
