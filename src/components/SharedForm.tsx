"use client";

import googleIcon from "@/assets/icons/logo.jpg";
import ContinueWithGoogleButton from "@/components/ContinueWithGoogleButton";
import FormDivider from "@/components/FormDivider";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import InputField from "./InputField";
import CustomButton from "./CustomButton";

interface SharedFormProps {
    mode: string;
    handleSubmit: ({
        email,
        password,
        name,
    }: {
        email: string;
        password: string;
        name: string;
    }) => {};
    isLoading: boolean;
}

const SharedForm = ({ mode, handleSubmit, isLoading }: SharedFormProps) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    return (
        <div className="flex h-screen gap-8 p-8">
            <div className="mx-auto flex w-[448px] flex-col gap-6 rounded-md border p-8 lg:mx-0">
                <div className="flex justify-center">
                    <Image src={googleIcon} alt="logo" width={48} height={48} />
                </div>

                <div className="grid w-full gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-2xl font-medium">
                            {mode === "signup" ? "Sign Up" : "Login"}
                        </h1>
                        <p className="text-muted-foreground text-balance text-sm text-neutral-400">
                            {mode === "signup"
                                ? "Sign up using email or another service to continue!"
                                : "Sign in using email or another service to continue!"}
                        </p>
                    </div>

                    <form className="grid gap-4" onSubmit={(e) => e.preventDefault()}>
                        {mode === "signup" && (
                            <div className="grid gap-2">
                                <InputField
                                    id="name"
                                    label="First"
                                    name="name"
                                    type="text"
                                    placeholder="Timo"
                                    onChange={setName}
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
                            onClick={() => handleSubmit({ email, password, name })}
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

            <div className="hidden w-1/2 flex-col justify-between bg-white py-8 lg:flex">
                <span className="text-xl font-semibold text-black">⌘ Microsoft Inc.</span>

                <div className="flex flex-col gap-2">
                    <p className="text-black">
                        “This lib has saved me countless hours of work and helped me deliver
                        stunning designs to our clients faster than ever before.”
                    </p>
                    <p className="text-sm font-medium text-black">Timo Hünnebeck</p>
                </div>
            </div>
        </div>
    );
};

export default SharedForm;
