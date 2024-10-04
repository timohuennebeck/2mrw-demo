"use client";

import FormButton from "@/components/FormButton";
import InputField from "@/components/InputField";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { sendResetEmail } from "./action";

const ForgotPasswordPage = () => {
    const [isSending, setIsSending] = useState(false);
    const [email, setEmail] = useState("");

    const handleSubmit = async () => {
        setIsSending(true);

        const { success, error } = await sendResetEmail({ email });

        setIsSending(false);

        if (error) {
            toast.error(error);
        } else if (success) {
            toast.success(success);
        }
    };

    return (
        <div className="bg-gray flex min-h-screen items-center justify-center p-4">
            <div className="w-full max-w-md rounded-md border border-input bg-white p-8">
                <h1 className="mb-4 text-2xl font-semibold">Forgot Password</h1>

                <p className="mb-6 text-sm text-gray-600">
                    Enter your email address below and we'll send you a link to reset your password.
                </p>

                <form className="flex flex-col gap-4">
                    <InputField
                        label="Email"
                        id="email"
                        type="email"
                        name="email"
                        onChange={setEmail}
                    />

                    <FormButton
                        title={isSending ? "Sending" : "Send Reset Link"}
                        onClick={handleSubmit}
                        disabled={isSending}
                    />
                </form>

                <p className="mt-4 text-center text-sm">
                    Remember password?{" "}
                    <Link href="/auth/sign-in" className="underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
