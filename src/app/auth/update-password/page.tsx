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
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async (formData: FormData) => {
        setIsUpdating(true);
        const { error } = await updatePassword({ password, confirmPassword });
        setIsUpdating(false);

        if (error) {
            toast.error(error);
        } else {
            // the redirect is handled on the server side
            toast.success("Password has been updated");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-4">
            <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-lg">
                <div className="mb-6 flex justify-center">
                    <Image
                        src={process.env.NEXT_PUBLIC_EMAIL_LOGO_BASE_URL ?? ""}
                        alt="Logo"
                        width={48}
                        height={48}
                    />
                </div>

                <h1 className="mb-4 text-center text-2xl font-semibold">Update Password</h1>

                <p className="mb-6 text-center text-sm text-neutral-600">
                    Enter your new password below to update your account.
                </p>

                <form>
                    <InputField
                        label="New Password"
                        id="password"
                        type="password"
                        name="password"
                        onChange={setPassword}
                    />
                    <InputField
                        label="Confirm New Password"
                        id="confirmPassword"
                        type="password"
                        name="confirmPassword"
                        onChange={setConfirmPassword}
                    />

                    <FormButton
                        title={isUpdating ? "Updating..." : "Update Password"}
                        disabled={isUpdating}
                        onClick={handleSubmit}
                    />
                </form>

                <p className="mt-4 text-center text-sm text-neutral-600">
                    Remember your password?{" "}
                    <Link
                        href="/auth/sign-in"
                        className="font-medium text-black transition-colors hover:text-neutral-800"
                    >
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default UpdatePasswordPage;
