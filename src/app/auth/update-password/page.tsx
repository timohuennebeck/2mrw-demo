"use client";

import FormButton from "@/components/FormButton";
import InputField from "@/components/InputField";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { updatePassword } from "./action";
import TestimonialBackground from "@/components/TestimonialBackground";
import googleIcon from "@/assets/icons/logo.jpg";

const UpdatePasswordPage = () => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async () => {
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
        <TestimonialBackground>
            <div className="mx-auto flex w-[448px] flex-col gap-6 rounded-md border p-8 lg:mx-0">
                <div className="flex justify-center">
                    <Image src={googleIcon} alt="logo" width={48} height={48} />
                </div>

                <div className="grid gap-2 text-center">
                    <h1 className="text-2xl font-medium">Update Password</h1>
                    <p className="text-sm text-neutral-400">
                        Enter Your new password below to update Your account.
                    </p>
                </div>

                <form className="flex flex-col gap-4">
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

                <p className="mt-4 text-center text-sm">
                    Remember password?{" "}
                    <Link href="/auth/sign-in" className="underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </TestimonialBackground>
    );
};

export default UpdatePasswordPage;
