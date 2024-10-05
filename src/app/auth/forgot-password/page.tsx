"use client";

import InputField from "@/components/InputField";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { sendPasswordResetEmail } from "./action";
import TestimonialBackground from "@/components/TestimonialBackground";
import Image from "next/image";
import CustomButton from "@/components/CustomButton";
import { TextConstants } from "@/constants/TextConstants";

const ForgotPasswordPage = () => {
    const [isSending, setIsSending] = useState(false);
    const [email, setEmail] = useState("");

    const handleSubmit = async () => {
        if (email === "") {
            toast.error(TextConstants.ERROR__EMAIL_IS_MISSING);
            return;
        }

        if (!email.includes("@")) {
            toast.error(TextConstants.ERROR__EMAIL_IS_MISSING_AT_SIGN);
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
                    <Image
                        src={process.env.NEXT_PUBLIC_EMAIL_LOGO_BASE_URL ?? ""}
                        alt="logo"
                        width={48}
                        height={48}
                    />
                </div>

                <div className="grid gap-2 text-center">
                    <h1 className="text-2xl font-medium">Forgot Password</h1>
                    <p className="text-sm text-neutral-400">
                        {TextConstants.TEXT__ENTER_EMAIL_BELOW}
                    </p>
                </div>

                <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                    <InputField
                        label="Email"
                        id="email"
                        type="email"
                        name="email"
                        placeholder={TextConstants.TEXT__EMAIL_PLACEHOLDER}
                        onChange={setEmail}
                    />

                    <CustomButton
                        title={
                            isSending
                                ? TextConstants.TEXT__SENDING
                                : TextConstants.TEXT__SEND_RESET_LINK
                        }
                        disabled={isSending}
                        onClick={handleSubmit}
                    />
                </form>

                <p className="mt-4 text-center text-sm">
                    {TextConstants.TEXT__REMEMBER_PASSWORD}{" "}
                    <Link href="/auth/sign-in" className="underline">
                        {TextConstants.TEXT__SIGN_IN}
                    </Link>
                </p>
            </div>
        </TestimonialBackground>
    );
};

export default ForgotPasswordPage;
