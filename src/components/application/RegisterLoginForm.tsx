"use client";

import FormDivider from "@/components/application/FormDivider";
import GoogleButton from "@/components/application/GoogleButton";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { TextConstants } from "@/constants/TextConstants";
import { StatusMessage } from "@/interfaces";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import FormStatusMessage from "./FormStatusMessage";
import PasswordStrengthChecker from "./PasswordStrengthChecker";

const _getButtontext = (mode: string, authMethod: string) => {
    if (authMethod === "magic-link" && mode === "signin") {
        return TextConstants.TEXT__LOGIN_WITH_MAGIC_LINK;
    }

    if (authMethod === "magic-link" && mode === "signup") {
        return TextConstants.TEXT__SIGN_UP_WITH_MAGIC_LINK;
    }

    return mode === "signup" ? TextConstants.TEXT__SIGN_UP : TextConstants.TEXT__SIGN_IN;
};

const _createFormSchema = (mode: string, authMethod: string) => {
    // base schema with email validation
    const baseSchema = {
        email: z.string().email({
            message: TextConstants.ERROR__INVALID_EMAIL,
        }),
    };

    // for magic link (both signin and signup), we only need email
    if (authMethod === "magic-link") {
        return z.object(baseSchema);
    }

    // for password signin, we need email and password
    if (mode === "signin" && authMethod === "password") {
        return z.object({
            ...baseSchema,
            password: z.string().min(1, {
                message: TextConstants.ERROR__PASSWORD_IS_MISSING,
            }),
        });
    }

    // for password signup, we need all fields
    return z.object({
        ...baseSchema,
        firstName: z.string().min(1, {
            message: TextConstants.ERROR__FIRST_NAME_IS_MISSING,
        }),
        password: z.string().min(1, {
            message: TextConstants.ERROR__PASSWORD_IS_MISSING,
        }),
    });
};

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
    loginOrSignupWithMagicLink?: (email: string) => void;
    isLoading: boolean;
    statusMessage: StatusMessage | null;
    setStatusMessage: (statusMessage: StatusMessage | null) => void;
}

const RegisterLoginForm = ({
    mode,
    handleSubmit,
    loginOrSignupWithMagicLink,
    isLoading,
    statusMessage,
    setStatusMessage,
}: RegisterLoginFormParams) => {
    const searchParams = useSearchParams();

    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [showStrengthChecker, setShowStrengthChecker] = useState(false);

    const authMethod = searchParams.get("method") || "magic-link";

    const registerLoginForm = useForm({
        resolver: zodResolver(_createFormSchema(mode, authMethod)),
        defaultValues: {
            firstName: "",
            email: "",
            password: "",
        },
    });

    const handleFormSubmit = (values: { firstName: string; email: string; password: string }) => {
        const { firstName, email, password } = values;

        if (authMethod === "magic-link") {
            loginOrSignupWithMagicLink?.(email);
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
                            {mode === "signup" && authMethod === "password" && (
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
                                                name="email"
                                                type="email"
                                                placeholder={TextConstants.TEXT__EMAIL_PLACEHOLDER}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {authMethod === "password" && (
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
                                                    name="password"
                                                    type="password"
                                                    placeholder="••••••••"
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

                            {mode === "signin" && authMethod === "password" && (
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
                                disabled={isLoading}
                                isLoading={isLoading}
                            >
                                {_getButtontext(mode, authMethod)}
                            </Button>

                            {mode === "signin" && authMethod === "magic-link" && (
                                <p className="text-center text-sm text-gray-500">
                                    You'll be emailed a magic code for a password-free sign in or{" "}
                                    <Link
                                        href="/auth/sign-in?method=password"
                                        className="underline"
                                    >
                                        sign in with password instead
                                    </Link>
                                </p>
                            )}

                            {mode === "signup" && authMethod === "magic-link" && (
                                <p className="text-center text-sm text-gray-500">
                                    You'll be emailed a magic code for a password-free sign up or{" "}
                                    <Link
                                        href="/auth/sign-up?method=password"
                                        className="underline"
                                    >
                                        sign up with password instead
                                    </Link>
                                </p>
                            )}
                        </form>
                    </Form>

                    {!isPasswordFocused && (
                        <>
                            <FormDivider />
                            <GoogleButton setStatusMessage={setStatusMessage} />
                        </>
                    )}

                    <div className="text-center text-sm">
                        {mode === "signup"
                            ? TextConstants.TEXT__HAVE_AN_ACCOUNT
                            : TextConstants.TEXT__DO_NOT_HAVE_AN_ACCOUNT}{" "}
                        <Link
                            href={
                                mode === "signup"
                                    ? "/auth/sign-in?method=magic-link"
                                    : "/auth/sign-up?method=magic-link"
                            }
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
