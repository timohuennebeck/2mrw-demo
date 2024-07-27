"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import { sendConfirmationEmail } from "./action";
import FormButton from "@/components/FormButton";

const EmailConfirmationContent = () => {
    const [isResending, setIsResending] = useState(false);
    const searchParams = useSearchParams();
    const email = searchParams.get("email");

    const handleResendEmail = async (formData: FormData) => {
        setIsResending(true);

        const { success, error } = await sendConfirmationEmail(formData);

        setIsResending(false);

        if (error) {
            toast.error(error);
        } else if (success) {
            toast.success(success);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg border p-8 max-w-md w-full">
            <div className="flex justify-center mb-6">
                <Image
                    src={process.env.NEXT_PUBLIC_EMAIL_LOGO_BASE_URL ?? ""}
                    alt="Logo"
                    width={48}
                    height={48}
                />
            </div>

            <h1 className="text-2xl font-semibold text-center mb-6">Email Verification Required</h1>

            <p className="text-center text-gray-600 mb-2 text-sm">
                The confirmation email was sent to:
            </p>
            <p className="text-center font-semibold mb-4">{email}</p>

            <p className="text-center text-gray-600 mb-8 text-sm">
                Please click the verification link in the email to activate your account and get
                started.
            </p>

            <FormButton
                title={isResending ? "Resending..." : "Resend Email"}
                onClick={handleResendEmail}
                disabled={isResending}
            />

            <p className="text-center text-sm text-gray-600 mt-4">
                Didn't receive the email? Have a look into your junk folder.
            </p>
        </div>
    );
};

const EmailConfirmationPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Suspense>
                <EmailConfirmationContent />
            </Suspense>
        </div>
    );
};

export default EmailConfirmationPage;
