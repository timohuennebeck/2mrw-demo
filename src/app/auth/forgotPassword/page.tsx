"use client";

import { useRef, useState } from "react";
import DefaultButton from "@/components/DefaultButton";
import InputField from "@/components/InputField";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import Link from "next/link";
import FormButton from "@/components/FormButton";
import Image from "next/image";

const ForgotPasswordPage = () => {
    const [isSending, setIsSending] = useState(false);

    const supabase = createClient();

    const handleSendResetEmail = async (formData: FormData) => {
        const email = formData.get("email") as string;

        if (!email) {
            toast.error("Please enter your email address");
            return;
        }

        setIsSending(true);

        toast.promise(
            supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/updatePassword`,
            }),
            {
                loading: "Sending reset email...",
                success: () => {
                    setIsSending(false);
                    return "Password reset email has been sent";
                },
                error: (error) => {
                    console.error("Error sending password reset email:", error);
                    setIsSending(false);
                    return "Failed to send password reset email. Please try again.";
                },
            },
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-lg border p-8 max-w-md w-full">
                <div className="flex justify-center mb-6">
                    <Image src="https://i.imgur.com/e0cWC6I.png" alt="" className="w-12 h-12" />
                </div>

                <h1 className="text-2xl font-semibold text-center mb-4">Forgot Password</h1>

                <p className="text-center text-gray-600 mb-6 text-sm">
                    Enter your email address below and we'll send you a link to reset your password.
                </p>

                <form>
                    <InputField label="Email" id="email" type="email" name="email" />

                    <FormButton
                        title="Send Reset Link"
                        onClick={handleSendResetEmail}
                        disabled={isSending}
                    />
                </form>

                <p className="text-center text-sm text-gray-600 mt-4">
                    Remember your password?{" "}
                    <Link
                        href="/auth/signIn"
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
