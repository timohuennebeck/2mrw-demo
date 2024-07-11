"use client";

import FormButton from "@/components/FormButton";
import FormDivider from "@/components/FormDivider";
import FormHeader from "@/components/FormHeader";
import GoogleSignUpButton from "@/components/GoogleSignUpButton";
import InputField from "@/components/InputField";
import RememberMeCheckbox from "@/components/RememberMeCheckbox";
import SignUpLink from "@/components/SignUpLink";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { signIn } from "./action";
import { useRouter } from "next/navigation";

const SignInForm = () => {
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {
        setIsLoading(true);

        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        if (email === "") {
            toast.error("Email is missing");
            setIsLoading(false);
            return;
        }

        if (password === "") {
            toast.error("Password is missing");
            setIsLoading(false);
            return;
        }

        toast.promise(signIn(formData), {
            loading: "Signing in...",
            success: (result) => {
                if (result.success) {
                    setIsLoading(false);

                    router.replace(result.redirect ?? "/");

                    return "Sign in successful!";
                }
                throw new Error(result.error);
            },
            error: (err) => {
                setIsLoading(false);
                return err.message;
            },
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-lg border p-8 max-w-md w-full">
                <div className="flex justify-center mb-6">
                    <img src="https://i.imgur.com/e0cWC6I.png" alt="" className="w-12 h-12" />
                </div>

                <FormHeader
                    title="Sign In"
                    subtitle="Sign in using email or another service to continue with Forj (it's free)!"
                />

                <form>
                    <InputField label="Email" id="email" name="email" type="email" />
                    <InputField label="Password" id="password" name="password" type="password" />
                    <div className="flex items-center justify-between mb-6">
                        <RememberMeCheckbox />
                        <Link
                            href="/auth/signUp"
                            className="text-sm font-medium text-black hover:text-gray-800 transition-colors"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <FormButton title="Sign In" onPress={handleSubmit} disabled={isLoading} />
                </form>

                <div className="mt-6">
                    <SignUpLink
                        title="Don't have an account?"
                        buttonText="Sign Up"
                        link="/auth/signUp"
                    />
                    <FormDivider />
                    <GoogleSignUpButton />
                </div>
            </div>
        </div>
    );
};

export default SignInForm;
