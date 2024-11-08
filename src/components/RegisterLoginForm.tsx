"use client";

import ContinueWithGoogleButton from "@/components/ContinueWithGoogleButton";
import FormDivider from "@/components/FormDivider";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import InputField from "./InputField";
import CustomButton from "./CustomButton";
import { TextConstants } from "@/constants/TextConstants";
import PasswordStrengthChecker from "./PasswordStrengthChecker";

interface RegisterLoginForm {
    mode: string;
    handleSubmit: ({
        email,
        password,
        firstName,
    }: {
        email: string;
        password: string;
        firstName: string;
    }) => void;
    loginWithMagicLink?: (email: string) => void;
    isLoading: boolean;
}

const RegisterLoginForm = ({
    mode,
    handleSubmit,
    loginWithMagicLink,
    isLoading,
}: RegisterLoginForm) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [showStrengthChecker, setShowStrengthChecker] = useState(false);
    const [authType, setAuthType] = useState("magicLink");

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
                        <p className="text-sm text-neutral-400">
                            {mode === "signup"
                                ? TextConstants.TEXT__SIGN_UP_EMAIIL_OR_ANOTHER_SERVICE
                                : TextConstants.TEXT__SIGN_IN_EMAIL_OR_ANOTHER_SERVICE}
                        </p>
                    </div>

                    <form className="grid gap-4" onSubmit={(e) => e.preventDefault()}>
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
                                    onChange={setFirstName}
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
                            onChange={setEmail}
                        />
                        {(authType === "password" || mode === "signup") && (
                            <InputField
                                id="password"
                                dataTestId="password-input"
                                label="Password"
                                name="password"
                                type="password"
                                value={password}
                                onChange={setPassword}
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
                            dataTestId="sign-in-button"
                            title={
                                authType === "magicLink" && mode === "signin"
                                    ? TextConstants.TEXT__LOGIN_WITH_MAGIC_LINK
                                    : mode === "signup"
                                      ? TextConstants.TEXT__SIGN_UP
                                      : TextConstants.TEXT__SIGN_IN
                            }
                            onClick={() =>
                                authType === "magicLink" && mode === "signin"
                                    ? loginWithMagicLink?.(email)
                                    : handleSubmit({ email, password, firstName })
                            }
                            disabled={isLoading}
                            isLoading={isLoading}
                        />

                        {mode === "signin" && authType === "magicLink" && (
                            <p className="text-center text-sm text-neutral-500">
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
                                <ContinueWithGoogleButton />
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
