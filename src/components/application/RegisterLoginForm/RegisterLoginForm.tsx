"use client";

import GoogleButton from "@/components/application/GoogleButton/GoogleButton";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { validateEmailFormat } from "@/utils/validators/formatValidator";
import { RegisterLoginFormParams } from "./RegisterLoginForm.interface";
import { TextConstants } from "@/constants/TextConstants";
import FormStatusMessage from "../FormStatusMessage/FormStatusMessage";
import InputField from "@/components/application/InputField/InputField";
import PasswordStrengthChecker from "../PasswordStrengthChecker/PasswordStrengthChecker";
import CustomButton from "@/components/application/CustomButton/CustomButton";
import FormDivider from "../FormDivider/FormDivider";

const RegisterLoginForm = ({
    mode,
    handleSubmit,
    loginWithMagicLink,
    isLoading,
    statusMessage,
}: RegisterLoginFormParams) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [showStrengthChecker, setShowStrengthChecker] = useState(false);
    const [authType, setAuthType] = useState("magicLink");
    const [errors, setErrors] = useState({
        email: "",
        password: "",
        firstName: "",
    });

    const checkFormInput = () => {
        const newErrors = {
            email: "",
            password: "",
            firstName: "",
        };

        if (email === "") {
            newErrors.email = TextConstants.ERROR__EMAIL_IS_MISSING;
        } else if (!validateEmailFormat(email)) {
            newErrors.email = TextConstants.ERROR__INVALID_EMAIL;
        }

        if ((authType === "password" || mode === "signup") && password === "") {
            console.log("→ [LOG] Triggered section");
            newErrors.password = TextConstants.ERROR__PASSWORD_IS_MISSING;
        }

        if (mode === "signup" && firstName === "") {
            newErrors.firstName = TextConstants.ERROR__FIRST_NAME_IS_MISSING;
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some((error) => error !== "");
    };

    const handleFormSubmit = () => {
        if (!checkFormInput()) return;

        if (authType === "magicLink" && mode === "signin") {
            loginWithMagicLink?.(email);
        } else {
            handleSubmit({ email, password, firstName });
        }
    };

    const handlePasswordFocus = () => {
        if (mode === "signup") {
            setIsPasswordFocused(true);
            setShowStrengthChecker(true);
        }
    };

    const handlePasswordBlur = () => {
        if (mode === "signup") {
            // keep the strength checker visible for 2 more seconds, so that the user can click the sign up button without it jumping
            setTimeout(() => {
                setIsPasswordFocused(false);
                setShowStrengthChecker(false);
            }, 2000);
        }
    };

    return (
        <div className="flex h-full items-center justify-center">
            <div className="mx-auto flex w-[448px] flex-col gap-4 rounded-md border p-8 shadow-sm lg:mx-0">
                <div className="mb-4 flex items-center gap-2">
                    <Image
                        src="https://framerusercontent.com/images/XmxX3Fws7IH91jzhxBjAhC9CrPM.svg"
                        alt="logo"
                        width={40}
                        height={40}
                    />
                </div>

                <div className="grid w-full gap-6">
                    <div className="grid gap-2">
                        <h1 className="text-2xl font-medium">
                            {mode === "signup"
                                ? TextConstants.TEXT__SIGN_UP
                                : TextConstants.TEXT__SIGN_IN}{" "}
                            to {TextConstants.TEXT__COMPANY_TITLE}
                        </h1>
                        <p className="text-sm text-gray-400">
                            {mode === "signup"
                                ? TextConstants.TEXT__SIGN_UP_EMAIIL_OR_ANOTHER_SERVICE
                                : TextConstants.TEXT__SIGN_IN_EMAIL_OR_ANOTHER_SERVICE}
                        </p>
                    </div>

                    {statusMessage && (
                        <FormStatusMessage
                            message={statusMessage.message}
                            type={statusMessage.type}
                            action={statusMessage.action}
                        />
                    )}
                    <form className="grid gap-4" onSubmit={(e) => e.preventDefault()} noValidate>
                        {mode === "signup" && (
                            <div className="grid gap-2">
                                <InputField
                                    id="firstName"
                                    dataTestId="first-name-input"
                                    label="First name"
                                    name="firstName"
                                    type="text"
                                    value={firstName}
                                    placeholder={TextConstants.TEXT__FIRST_NAME_PLACEHOLDER}
                                    onChange={(value) => {
                                        setFirstName(value);
                                        setErrors((prev) => ({ ...prev, firstName: "" }));
                                    }}
                                    error={errors.firstName}
                                    hasError={!!errors.firstName}
                                />
                            </div>
                        )}
                        <InputField
                            id="email"
                            dataTestId="email-input"
                            label="Email"
                            name="email"
                            type="email"
                            placeholder={TextConstants.TEXT__EMAIL_PLACEHOLDER}
                            value={email}
                            onChange={(value) => {
                                setEmail(value);
                                setErrors((prev) => ({ ...prev, email: "" }));
                            }}
                            error={errors.email}
                            hasError={!!errors.email}
                        />
                        {(authType === "password" || mode === "signup") && (
                            <InputField
                                id="password"
                                dataTestId="password-input"
                                label="Password"
                                name="password"
                                type="password"
                                value={password}
                                onChange={(value) => {
                                    setPassword(value);
                                    setErrors((prev) => ({ ...prev, password: "" }));
                                }}
                                error={errors.password}
                                hasError={!!errors.password}
                                onFocus={() => mode === "signup" && handlePasswordFocus()}
                                onBlur={() => mode === "signup" && handlePasswordBlur()}
                            />
                        )}

                        {mode === "signup" && (isPasswordFocused || showStrengthChecker) && (
                            <PasswordStrengthChecker password={password} />
                        )}

                        {mode === "signin" && authType === "password" && (
                            <div className="flex items-center">
                                <Link
                                    href="/auth/forgot-password"
                                    className="ml-auto inline-block text-sm underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                        )}

                        <CustomButton
                            dataTestId={`${mode === "signup" ? "sign-up" : "sign-in"}-button`}
                            title={
                                authType === "magicLink" && mode === "signin"
                                    ? TextConstants.TEXT__LOGIN_WITH_MAGIC_LINK
                                    : mode === "signup"
                                      ? TextConstants.TEXT__SIGN_UP
                                      : TextConstants.TEXT__SIGN_IN
                            }
                            onClick={handleFormSubmit}
                            disabled={isLoading}
                            isLoading={isLoading}
                        />

                        {mode === "signin" && authType === "magicLink" && (
                            <p className="text-center text-sm text-gray-500">
                                You'll be emailed a magic code for a password-free sign in or{" "}
                                <button
                                    data-testid="password-sign-in-toggle"
                                    onClick={() => setAuthType("password")}
                                    className="underline"
                                >
                                    sign in with password instead
                                </button>
                            </p>
                        )}

                        {!isPasswordFocused && (
                            <>
                                <FormDivider />
                                <GoogleButton />
                            </>
                        )}
                    </form>

                    <div className="text-center text-sm">
                        {mode === "signup"
                            ? TextConstants.TEXT__HAVE_AN_ACCOUNT
                            : TextConstants.TEXT__DO_NOT_HAVE_AN_ACCOUNT}{" "}
                        <Link
                            href={mode === "signup" ? "/auth/sign-in" : "/auth/sign-up"}
                            className="underline"
                            data-testid={`${mode === "signup" ? "signup" : "signin"}-toggle`}
                        >
                            {mode === "signup"
                                ? TextConstants.TEXT__SIGN_IN
                                : TextConstants.TEXT__SIGN_UP}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterLoginForm;
