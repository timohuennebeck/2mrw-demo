"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { TextConstants } from "@/constants/TextConstants";
import { checkUserEmailExists } from "@/services/database/userService";
import { createClient } from "@/services/integration/client";
import { StatusMessage } from "@/interfaces";
import FormStatusMessage from "@/components/application/FormStatusMessage";
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
import { Button } from "@/components/ui/button";

const forgotPasswordFormSchema = z.object({
    email: z.string().email({
        message: TextConstants.ERROR__INVALID_EMAIL,
    }),
});

const _sendPasswordResetEmail = async (email: string) => {
    const supabase = createClient();
    const result = await supabase.auth.resetPasswordForEmail(email);
    return result;
};

const ForgotPasswordPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null);

    const forgotPasswordForm = useForm({
        resolver: zodResolver(forgotPasswordFormSchema),
        defaultValues: {
            email: "",
        },
    });

    const handleFormSubmit = async (values: { email: string }) => {
        setIsLoading(true);
        const { emailExists } = await checkUserEmailExists(values.email);

        if (!emailExists) {
            setIsLoading(false);
            setStatusMessage({
                type: "error",
                message: TextConstants.TEXT__USER_DOES_NOT_EXIST,
            });
            setTimeout(() => setStatusMessage(null), 5000);
            return;
        }

        const result = await _sendPasswordResetEmail(values.email);
        if (result.error) {
            setIsLoading(false);
            setStatusMessage({
                type: "error",
                message: result.error.message,
            });
            setTimeout(() => setStatusMessage(null), 5000);
            return;
        }

        setIsLoading(false);
        setStatusMessage({
            type: "info",
            message: TextConstants.TEXT__RESET_PASSWORD_EMAIL_SENT,
        });

        setTimeout(() => {
            setStatusMessage({
                type: "info",
                message: TextConstants.TEXT__DIDNT_RECEIVE_EMAIL,
                action: {
                    label: TextConstants.TEXT__RESEND_EMAIL,
                    onClick: async () => await _sendPasswordResetEmail(values.email),
                },
            });
        }, 4000);
    };

    return (
        <div className="flex h-full items-center justify-center">
            <div className="mx-auto flex flex-col gap-4">
                <div className="mb-4 flex items-center gap-2">
                    <Image
                        src="https://framerusercontent.com/images/XmxX3Fws7IH91jzhxBjAhC9CrPM.svg"
                        alt="logo"
                        width={40}
                        height={40}
                    />
                </div>

                <div className="grid gap-2">
                    <h1 className="text-2xl font-semibold">Forgot Password</h1>
                    <p className="text-sm text-gray-400">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi ipsam
                        molestiae tenetur iure enim tempore!
                    </p>
                </div>

                <FormStatusMessage
                    message={statusMessage?.message ?? ""}
                    type={statusMessage?.type ?? "info"}
                    action={statusMessage?.action}
                />

                <Form {...forgotPasswordForm}>
                    <form
                        onSubmit={forgotPasswordForm.handleSubmit(handleFormSubmit)}
                        className="flex flex-col gap-4"
                    >
                        <FormField
                            control={forgotPasswordForm.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="m@example.com" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={isLoading}>
                            {TextConstants.TEXT__SEND_RESET_LINK}
                        </Button>
                    </form>
                </Form>

                <p className="mt-4 text-center text-sm">
                    {TextConstants.TEXT__REMEMBER_PASSWORD}{" "}
                    <Link href="/auth/sign-in?method=magic-link" className="underline">
                        {TextConstants.TEXT__SIGN_IN}
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
