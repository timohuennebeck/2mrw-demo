"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useState } from "react";
import { updatePassword } from "./action";
import { useSearchParams } from "next/navigation";
import { TextConstants } from "@/constants/TextConstants";
import PasswordStrengthChecker from "@/components/application/PasswordStrengthChecker";
import FormStatusMessage from "@/components/application/FormStatusMessage";
import { StatusMessage } from "@/interfaces";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";

const updatePasswordFormSchema = z
    .object({
        password: z.string().min(1, {
            message: TextConstants.ERROR__PASSWORD_IS_MISSING,
        }),
        confirmPassword: z.string().min(1, {
            message: TextConstants.ERROR__CONFIRMATION_PASSWORD_IS_MISSING,
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: TextConstants.ERROR__PASSWORDS_DO_NOT_MATCH,
        path: ["confirmPassword"],
    });

const SearchParamsHandler = () => {
    const searchParams = useSearchParams();
    return {
        accessToken: searchParams.get("access_token") ?? "",
        refreshToken: searchParams.get("refresh_token") ?? "",
    };
};

const UpdatePassword = () => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null);

    let tokens = { accessToken: "", refreshToken: "" };

    const updatePasswordForm = useForm({
        resolver: zodResolver(updatePasswordFormSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const handleFormSubmit = async (values: { password: string; confirmPassword: string }) => {
        setIsUpdating(true);
        const result = await updatePassword({
            password: values.password,
            accessToken: tokens.accessToken ?? "",
            refreshToken: tokens.refreshToken ?? "",
        });
        setIsUpdating(false);

        if (result.error) {
            setStatusMessage({
                type: "error",
                message: result.error ?? TextConstants.ERROR__UNEXPECTED_ERROR,
            });
            setTimeout(() => setStatusMessage(null), 5000);
            return;
        }

        setStatusMessage({
            type: "info",
            message: TextConstants.TEXT__PASSWORD_HAS_BEEN_UPDATED,
        });
    };

    return (
        <div className="flex h-full items-center">
            <Suspense>
                {(() => {
                    tokens = SearchParamsHandler();
                    return null;
                })()}
            </Suspense>

            <div className="flex w-full flex-col gap-4">
                <div className="mb-4 flex items-center gap-2">
                    <Image
                        src="https://framerusercontent.com/images/XmxX3Fws7IH91jzhxBjAhC9CrPM.svg"
                        alt="logo"
                        width={40}
                        height={40}
                    />
                </div>

                <div className="grid gap-2">
                    <h1 className="text-2xl font-semibold">
                        {TextConstants.TEXT__UPDATE_PASSWORD}
                    </h1>
                    <p className="text-sm text-gray-400">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem
                        consectetur assumenda minus molestias magni exercitationem.
                    </p>
                </div>

                {statusMessage && (
                    <FormStatusMessage message={statusMessage.message} type={statusMessage.type} />
                )}

                <Form {...updatePasswordForm}>
                    <form
                        onSubmit={updatePasswordForm.handleSubmit(handleFormSubmit)}
                        className="flex flex-col gap-4"
                    >
                        <FormField
                            control={updatePasswordForm.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="password" placeholder="******" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={updatePasswordForm.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="password" placeholder="******" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="pb-4">
                            <PasswordStrengthChecker
                                password={updatePasswordForm.watch("password")}
                            />
                        </div>

                        <Button type="submit" disabled={isUpdating} isLoading={isUpdating}>
                            {TextConstants.TEXT__UPDATE_PASSWORD}
                        </Button>
                    </form>
                </Form>

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

const UpdatePasswordPage = () => {
    return (
        <Suspense>
            <UpdatePassword />
        </Suspense>
    );
};

export default UpdatePasswordPage;
