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

    const handleSubmit = async (formData: FormData) => {
        setIsSending(true);

        const { success, error } = await sendResetEmail(formData);

        setIsSending(false);

        if (error) {
            toast.error(error);
        } else if (success) {
            toast.success(success);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-lg border p-8 max-w-md w-full">
                <div className="flex justify-center mb-6">
                    <Image
                        src={process.env.NEXT_PUBLIC_EMAIL_LOGO_BASE_URL ?? ""}
                        alt="Logo"
                        width={48}
                        height={48}
                    />
                </div>

                <h1 className="text-2xl font-semibold text-center mb-4">Forgot Password</h1>

                <p className="text-center text-gray-600 mb-6 text-sm">
                    Enter your email address below and we'll send you a link to reset your password.
                </p>

                <form>
                    <InputField label="Email" id="email" type="email" name="email" />

                    <FormButton
                        title="Send Reset Link"
                        onClick={handleSubmit}
                        disabled={isSending}
                    />
                </form>

                <p className="text-center text-sm text-gray-600 mt-4">
                    Remember your password?{" "}
                    <Link
                        href="/auth/sign-in"
                        className="font-medium text-black hover:text-gray-800 transition-colors"
                    >
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
