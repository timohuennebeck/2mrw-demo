"use client";

import { useState } from "react";
import InputField from "@/components/InputField";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import Link from "next/link";
import FormButton from "@/components/FormButton";
import { useRouter } from "next/navigation";
import Image from "next/image";

const UpdatePasswordPage = () => {
    const [isUpdating, setIsUpdating] = useState(false);

    const supabase = createClient();
    const router = useRouter();

    const handleUpdatePassword = async (formData: FormData) => {
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setIsUpdating(true);

        try {
            const { error } = await supabase.auth.updateUser({ password });

            if (error) throw error;

            toast.success("Password has been updated");

            router.push("/");
        } catch (err) {
            console.error("Change password error:", err);

            if (err instanceof Error) {
                toast.error(err.message);
            } else {
                toast.error("There has been an unexpected error.");
            }
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-lg border p-8 max-w-md w-full">
                <div className="flex justify-center mb-6">
                    <Image src={process.env.NEXT_PUBLIC_EMAIL_LOGO_BASE_URL ?? ""} alt="" width={48} height={48} />
                </div>

                <h1 className="text-2xl font-semibold text-center mb-4">Update Password</h1>

                <p className="text-center text-gray-600 mb-6 text-sm">
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
                        onClick={handleUpdatePassword}
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

export default UpdatePasswordPage;
