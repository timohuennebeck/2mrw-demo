"use client";

import InputField from "@/components/InputField";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import { updatePassword } from "./action";
import CustomButton from "@/components/CustomButton";
import { useRouter, useSearchParams } from "next/navigation";
import { TextConstants } from "@/constants/TextConstants";
import PasswordStrengthChecker from "@/components/PasswordStrengthChecker";

const UpdatePassword = () => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const router = useRouter();
    const searchParams = useSearchParams();
    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");

    const handleSubmit = async () => {
        if (password === "") {
            toast.error(TextConstants.ERROR__PASSWORD_IS_MISSING);
            return;
        }

        if (confirmPassword === "") {
            toast.error(TextConstants.ERROR__CONFIRMATION_PASSWORD_IS_MISSING);
            return;
        }

        if (password !== confirmPassword) {
            toast.error(TextConstants.ERROR__PASSWORDS_DO_NOT_MATCH);
            return;
        }

        setIsUpdating(true);
        const result = await updatePassword({
            password,
            accessToken: accessToken ?? "",
            refreshToken: refreshToken ?? "",
        });
        setIsUpdating(false);

        if (result.success) {
            router.replace(result.redirect ?? "/");
            toast.success(TextConstants.TEXT__PASSWORD_HAS_BEEN_UPDATED);
        } else {
            toast.error(result.error);
        }
    };

    return (
        <div className="flex h-full items-center justify-center">
            <div className="mx-auto flex w-[448px] flex-col gap-4 rounded-md border p-8 lg:mx-0">
                <div className="mb-4 flex items-center gap-2">
                    <Image
                        src="https://framerusercontent.com/images/XmxX3Fws7IH91jzhxBjAhC9CrPM.svg"
                        alt="logo"
                        width={40}
                        height={40}
                    />
                </div>

                <div className="grid gap-2">
                    <h1 className="text-2xl font-medium">{TextConstants.TEXT__UPDATE_PASSWORD}</h1>
                    <p className="text-sm text-neutral-400">
                        {TextConstants.TEXT__ENTER_PASSWORD_BELOW}
                    </p>
                </div>

                <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                    <InputField
                        label={TextConstants.TEXT__NEW_PASSWORD}
                        id="password"
                        type="password"
                        name="password"
                        onChange={setPassword}
                    />
                    <InputField
                        label={TextConstants.TEXT__CONFIRM_PASSWORD}
                        id="confirmPassword"
                        type="password"
                        name="confirmPassword"
                        onChange={setConfirmPassword}
                    />

                    <div className="pb-4">
                        <PasswordStrengthChecker password={password} />
                    </div>

                    <CustomButton
                        title={TextConstants.TEXT__UPDATE_PASSWORD}
                        disabled={isUpdating}
                        onClick={handleSubmit}
                        isLoading={isUpdating}
                    />
                </form>

                <p className="mt-4 text-center text-sm">
                    {TextConstants.TEXT__REMEMBER_PASSWORD}{" "}
                    <Link href="/auth/sign-in" className="underline">
                        {TextConstants.TEXT__SIGN_IN}
                    </Link>
                </p>
            </div>
        </div>
    );
};

const UpdatePasswordPage = () => {
    return (
        <Suspense>
            <UpdatePassword />
        </Suspense>
    );
};

export default UpdatePasswordPage;
