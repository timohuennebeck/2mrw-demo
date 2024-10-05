"use client";

import FormButton from "@/components/FormButton";
import InputField from "@/components/InputField";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { updatePassword } from "./action";

const UpdatePasswordPage = () => {
    const [isUpdating, setIsUpdating] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setIsUpdating(true);
        const { error } = await updatePassword(formData);
        setIsUpdating(false);

        if (error) {
            toast.error(error);
        } else {
            // the redirect is handled on the server side
            toast.success("Password has been updated");
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-lg border p-8 max-w-md w-full">
                <div className="flex justify-center mb-6">
                    <Image
                        src={process.env.NEXT_PUBLIC_EMAIL_LOGO_BASE_URL ?? ""}
                        alt="Logo"
                        width={48}
                        height={48}
                    />
                </div>

                <h1 className="text-2xl font-semibold text-center mb-4">Update Password</h1>

                <p className="text-center text-neutral-600 mb-6 text-sm">
                    Enter your new password below to update your account.
                </p>

                <form>
                    <InputField
                        label="New Password"
                        id="password"
                        type="password"
                        name="password"
                    />
                    <InputField
                        label="Confirm New Password"
                        id="confirmPassword"
                        type="password"
                        name="confirmPassword"
                    />

                    <FormButton
                        title={isUpdating ? "Updating..." : "Update Password"}
                        disabled={isUpdating}
                        onClick={handleSubmit}
                    />
                </form>

                <p className="text-center text-sm text-neutral-600 mt-4">
                    Remember your password?{" "}
                    <Link
                        href="/auth/sign-in"
                        className="font-medium text-black hover:text-neutral-800 transition-colors"
                    >
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default UpdatePasswordPage;
