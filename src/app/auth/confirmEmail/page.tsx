"use client";

import DefaultButton from "@/components/DefaultButton";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";

const EmailConfirmationContent = () => {
    const [isResending, setIsResending] = useState(false);
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const supabase = createClient();

    const handleResendEmail = async () => {
        if (!email) {
            toast.error("Email address is missing");
            return;
        }

        setIsResending(true);

        try {
            const { error } = await supabase.auth.resend({
                type: "signup",
                email: email,
            });

            if (error) {
                throw error;
            }

            toast.success("Confirmation email has been sent");
        } catch (error) {
            console.error("Error resending confirmation email:", error);
            toast.error(`Error resending email: ${error}`);
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg border p-8 max-w-md w-full">
            <div className="flex justify-center mb-6">
                <Image
                    src={process.env.EMAIL_LOGO_BASE_URL ?? ""}
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

            <DefaultButton
                title={isResending ? "Resending..." : "Resend Email"}
                onClick={handleResendEmail}
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
