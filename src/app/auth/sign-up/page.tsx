"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signUp } from "./action";
import SharedForm from "@/components/SharedForm";

const SignUpPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async ({
        email,
        password,
        name,
    }: {
        email: string;
        password: string;
        name: string;
    }) => {
        setIsLoading(true);

        if (email === "") {
            toast.error("Email is missing");
            setIsLoading(false);
            return;
        }

        toast.promise(signUp({ name, email, password }), {
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
                setIsLoading(false);
                return err.message;
            },
        });
    };

    return <SharedForm mode="signup" handleSubmit={handleSubmit} isLoading={isLoading} />;
};

export default SignUpPage;
