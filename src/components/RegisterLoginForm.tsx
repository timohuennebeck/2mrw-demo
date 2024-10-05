"use client";

import googleIcon from "@/assets/icons/logo.jpg";
import ContinueWithGoogleButton from "@/components/ContinueWithGoogleButton";
import FormDivider from "@/components/FormDivider";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import InputField from "./InputField";
import CustomButton from "./CustomButton";
import TestimonialBackground from "./TestimonialBackground";

interface RegisterLoginForm {
    mode: string;
    handleSubmit: ({
        email,
        password,
        firstName,
    }: {
        email: string;
        password: string;
        firstName: string;
    }) => {};
    isLoading: boolean;
}

const RegisterLoginForm = ({ mode, handleSubmit, isLoading }: RegisterLoginForm) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");

    return (
        <TestimonialBackground>
            <div className="mx-auto flex w-[448px] flex-col gap-6 rounded-md border p-8 lg:mx-0">
                <div className="flex justify-center">
                    <Image src={googleIcon} alt="logo" width={48} height={48} />
                </div>

                <div className="grid w-full gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-2xl font-medium">
                            {mode === "signup" ? "Sign Up" : "Login"}
                        </h1>
                        <p className="text-sm text-neutral-400">
                            {mode === "signup"
                                ? "Sign up using email or another service to continue!"
                                : "Sign in using email or another service to continue!"}
                        </p>
                    </div>

                    <form className="grid gap-4" onSubmit={(e) => e.preventDefault()}>
                        {mode === "signup" && (
                            <div className="grid gap-2">
                                <InputField
                                    id="firstName"
                                    label="First name"
                                    name="firstName"
                                    type="text"
                                    placeholder="Timo"
                                    onChange={setFirstName}
                                />
                            </div>
                        )}
                        <InputField
                            id="email"
                            label="Email"
                            name="email"
                            type="text"
                            placeholder="m@example.com"
                            onChange={setEmail}
                        />
                        <InputField
                            id="password"
                            label="Password"
                            name="password"
                            type="password"
                            onChange={setPassword}
                        />

                        <div className="flex items-center">
                            <Link
                                href="/auth/forgot-password"
                                className="ml-auto inline-block text-sm underline"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <CustomButton
                            title={mode === "signup" ? "Sign Up" : "Login"}
                            onClick={() => handleSubmit({ email, password, firstName })}
                            disabled={isLoading}
                        />

                        <FormDivider />

                        <ContinueWithGoogleButton />
                    </form>

                    <div className="text-center text-sm">
                        {mode === "signup" ? "Have an account? " : "Don't have an account? "}
                        <Link
                            href={mode === "signup" ? "/auth/sign-in" : "/auth/sign-up"}
                            className="underline"
                        >
                            {mode === "signup" ? "Log in" : "Sign up"}
                        </Link>
                    </div>
                </div>
            </div>
        </TestimonialBackground>
    );
};

export default RegisterLoginForm;
