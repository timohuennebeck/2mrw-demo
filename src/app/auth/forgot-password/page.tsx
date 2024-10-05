"use client";

import InputField from "@/components/InputField";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { sendPasswordResetEmail } from "./action";
import TestimonialBackground from "@/components/TestimonialBackground";
import Image from "next/image";
import googleIcon from "@/assets/icons/logo.jpg";
import CustomButton from "@/components/CustomButton";

const ForgotPasswordPage = () => {
    const [isSending, setIsSending] = useState(false);
    const [email, setEmail] = useState("");

    const handleSubmit = async () => {
        if (email === "") {
            toast.error("Email is missing.");
            return;
        }

        if (!email.includes("@")) {
            toast.error("Email is missing an '@'.");
            return;
        }

        setIsSending(true);

        const { success, error } = await sendPasswordResetEmail({ email });

        setIsSending(false);

        if (error) {
            toast.error(error);
        } else if (success) {
            toast.success(success);
        }
    };

    return (
        <TestimonialBackground>
            <div className="mx-auto flex w-[448px] flex-col gap-6 rounded-md border p-8 lg:mx-0">
                <div className="flex justify-center">
                    <Image src={googleIcon} alt="logo" width={48} height={48} />
                </div>

                <div className="grid gap-2 text-center">
                    <h1 className="text-2xl font-medium">Forgot Password</h1>
                    <p className="text-sm text-neutral-400">
                        Enter Your email address below and we'll send You a link to reset Your
                        password.
                    </p>
                </div>

                <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                    <InputField
                        label="Email"
                        id="email"
                        type="email"
                        name="email"
                        placeholder="m@example.com"
                        onChange={setEmail}
                    />

                    <CustomButton
                        title={isSending ? "Sending" : "Send Reset Link"}
                        disabled={isSending}
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

export default ForgotPasswordPage;
