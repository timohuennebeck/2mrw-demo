"use client";

import GoogleButton from "@/components/application/GoogleButton";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { validateEmailFormat } from "@/utils/validators/formatValidator";
import { TextConstants } from "@/constants/TextConstants";
import FormStatusMessage from "./FormStatusMessage";
import PasswordStrengthChecker from "./PasswordStrengthChecker";
import FormDivider from "@/components/application/FormDivider";
import { StatusMessage } from "@/interfaces";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

const _registerLoginFormSchema = z.object({
    firstName: z.string().optional(),
    email: z.string().email({
        message: TextConstants.ERROR__INVALID_EMAIL,
    }),
    password: z.string().min(1, {
        message: TextConstants.ERROR__PASSWORD_IS_MISSING,
    }),
});

export interface RegisterLoginFormParams {
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
    statusMessage?: StatusMessage | null;
}

const RegisterLoginForm = ({
    mode,
    handleSubmit,
    loginWithMagicLink,
    isLoading,
    statusMessage,
}: RegisterLoginFormParams) => {
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [showStrengthChecker, setShowStrengthChecker] = useState(false);
    const [authType, setAuthType] = useState("magicLink");

    const registerLoginForm = useForm({
        resolver: zodResolver(_registerLoginFormSchema),
        defaultValues: {
            firstName: "",
            email: "",
            password: "",
        },
    });

    const handleFormSubmit = (values: { firstName: string; email: string; password: string }) => {
        const { firstName, email, password } = values;

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
            <div className="flex w-full flex-col gap-4">
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
                        <h1 className="text-2xl font-semibold">
                            {mode === "signup"
                                ? TextConstants.TEXT__SIGN_UP
                                : TextConstants.TEXT__SIGN_IN}{" "}
                            to {TextConstants.TEXT__COMPANY_TITLE} to continue! 🙌
                        </h1>
                        <p className="text-sm text-gray-400">
                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Obcaecati
                            ullam eveniet laborum numquam quae quasi!
                        </p>
                    </div>

                    {statusMessage && (
                        <FormStatusMessage
                            message={statusMessage.message}
                            type={statusMessage.type}
                            action={statusMessage.action}
                        />
                    )}
                    <Form {...registerLoginForm}>
                        <form
                            className="grid gap-4"
                            onSubmit={(e) => {
                                e.preventDefault();
                                registerLoginForm.handleSubmit(handleFormSubmit)();
                            }}
                            noValidate
                        >
                            {mode === "signup" && (
                                <FormField
                                    control={registerLoginForm.control}
                                    name="firstName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>First name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    id="firstName"
                                                    data-test-id="first-name-input"
                                                    name="firstName"
                                                    type="text"
                                                    placeholder={
                                                        TextConstants.TEXT__FIRST_NAME_PLACEHOLDER
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            <FormField
                                control={registerLoginForm.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                id="email"
                                                data-test-id="email-input"
                                                name="email"
                                                type="email"
                                                placeholder={TextConstants.TEXT__EMAIL_PLACEHOLDER}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {(authType === "password" || mode === "signup") && (
                                <FormField
                                    control={registerLoginForm.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    id="password"
                                                    data-test-id="password-input"
                                                    name="password"
                                                    type="password"
                                                    placeholder="******"
                                                    onFocus={() =>
                                                        mode === "signup" && handlePasswordFocus()
                                                    }
                                                    onBlur={() =>
                                                        mode === "signup" && handlePasswordBlur()
                                                    }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            {mode === "signup" && (isPasswordFocused || showStrengthChecker) && (
                                <PasswordStrengthChecker
                                    password={registerLoginForm.watch("password")}
                                />
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

                            <Button
                                variant="default"
                                type="submit"
                                data-test-id={`${mode === "signup" ? "sign-up" : "sign-in"}-button`}
                                disabled={isLoading}
                                isLoading={isLoading}
                            >
                                {authType === "magicLink" && mode === "signin"
                                    ? TextConstants.TEXT__LOGIN_WITH_MAGIC_LINK
                                    : mode === "signup"
                                      ? TextConstants.TEXT__SIGN_UP
                                      : TextConstants.TEXT__SIGN_IN}
                            </Button>

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
                    </Form>

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
