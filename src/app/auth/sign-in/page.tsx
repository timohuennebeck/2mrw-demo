"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signIn } from "./action";
import RegisterLoginForm from "@/components/RegisterLoginForm";

const SignInPage = () => {
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async ({ email, password }: { email: string; password: string }) => {
        setIsLoading(true);

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

        toast.promise(signIn({ email, password }), {
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

    return <RegisterLoginForm mode="signin" handleSubmit={handleSubmit} isLoading={isLoading} />;
};

export default SignInPage;
