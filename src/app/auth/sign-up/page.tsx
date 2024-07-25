"use client";

import FormDivider from "@/components/FormDivider";
import FormHeader from "@/components/FormHeader";
import ContinueWithGoogleButton from "@/components/ContinueWithGoogleButton";
import InputField from "@/components/InputField";
import FormButton from "@/components/FormButton";
import RememberMeCheckbox from "@/components/RememberMeCheckbox";
import SignUpLink from "@/components/SignUpLink";
import { signUp } from "./action";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const SignUpForm = () => {
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);

        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            setIsLoading(false);
            return;
        }

        if (email === "") {
            toast.error("Email is missing");
            setIsLoading(false);
            return;
        }

        toast.promise(signUp(formData), {
            loading: "Signing up...",
            success: (result) => {
                if (result.success) {
                    setIsLoading(false);

                    router.push(`/auth/confirm-email?email=${encodeURIComponent(email)}`);

                    return "Sign up successful! There's just one last step.";
                }
                throw new Error(result.error);
            },
            error: (err) => {
                if (err.message?.toLowerCase() === "anonymous sign-ins are disabled") {
                    setIsLoading(false);
                    return "Email is missing";
                } else if (err.message?.toLowerCase() === "email rate limit exceeded") {
                    setIsLoading(false);
                    return "We're experiencing high traffic at the moment. Please wait a few seconds.";
                } else {
                    setIsLoading(false);
                    return err.message;
                }
            },
        });
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

                <FormHeader
                    title="Sign Up"
                    subtitle="Sign up using email or another service to continue with Forj (it takes 2 seconds)!"
                />

                <form>
                    <InputField label="First Name" id="firstName" name="firstName" type="text" />
                    <InputField label="Email" id="email" name="email" type="email" />
                    <InputField label="Password" id="password" name="password" type="password" />
                    <InputField
                        label="Confirm Password"
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                    />

                    <div className="flex items-center justify-between mb-6">
                        <RememberMeCheckbox />
                    </div>

                    <FormButton title="Sign Up" onClick={handleSubmit} disabled={isLoading} />
                </form>

                <div className="mt-6">
                    <SignUpLink title="Have an account?" buttonText="Sign In" link="/auth/sign-in" />
                    <FormDivider />
                    <ContinueWithGoogleButton />
                </div>
            </div>
        </div>
    );
};

export default SignUpForm;
