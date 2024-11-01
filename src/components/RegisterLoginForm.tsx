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
    }) => {};
    isLoading: boolean;
}

const RegisterLoginForm = ({ mode, handleSubmit, isLoading }: RegisterLoginForm) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [showStrengthChecker, setShowStrengthChecker] = useState(false);

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
                            to {TextConstants.EMAIL__COMPANY_TITLE}
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
                                    label="First name"
                                    name="firstName"
                                    type="text"
                                    placeholder={TextConstants.TEXT__FIRST_NAME_PLACEHOLDER}
                                    onChange={setFirstName}
                                />
                            </div>
                        )}
                        <InputField
                            id="email"
                            label="Email"
                            name="email"
                            type="text"
                            placeholder={TextConstants.TEXT__EMAIL_PLACEHOLDER}
                            onChange={setEmail}
                        />
                        <InputField
                            id="password"
                            label="Password"
                            name="password"
                            type="password"
                            onChange={setPassword}
                            onFocus={() => mode === "signup" && handlePasswordFocus()}
                            onBlur={() => mode === "signup" && handlePasswordBlur()}
                        />

                        {mode === "signup" && (isPasswordFocused || showStrengthChecker) && (
                            <PasswordStrengthChecker password={password} />
                        )}

                        <div className="flex items-center">
                            <Link
                                href="/auth/forgot-password"
                                className="ml-auto inline-block text-sm underline"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <CustomButton
                            title={
                                mode === "signup"
                                    ? TextConstants.TEXT__SIGN_UP
                                    : TextConstants.TEXT__SIGN_IN
                            }
                            onClick={() => handleSubmit({ email, password, firstName })}
                            disabled={isLoading}
                        />

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
