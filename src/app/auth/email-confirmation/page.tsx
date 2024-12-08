"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { TextConstants } from "@/constants/TextConstants";
import { useEffect, useState } from "react";

const EmailConfirmedPage = () => {
    const router = useRouter();

    const [timer, setTimer] = useState(5);

    useEffect(() => {
        // auto-redirect after 5 seconds
        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    router.push("/choose-pricing-plan");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [router]);

    return (
        <div className="flex h-screen items-center justify-center">
            <div className="mx-auto flex flex-col gap-6">
                <div className="flex items-center gap-2">
                    <Image
                        src="https://framerusercontent.com/images/XmxX3Fws7IH91jzhxBjAhC9CrPM.svg"
                        alt="logo"
                        width={40}
                        height={40}
                    />
                </div>

                <div>
                    <h1 className="mb-2 text-2xl font-semibold">Email Confirmed!</h1>
                    <p className="text-sm text-gray-500">
                        Your email has been confirmed. You can now continue using{" "}
                        {TextConstants.TEXT__COMPANY_TITLE}.
                    </p>
                </div>

                <Button onClick={() => router.push("/choose-pricing-plan")} className="w-full">
                    Choose Your Plan
                </Button>

                <p className="text-center text-sm text-gray-400">
                    You will be redirected in {timer} seconds...
                </p>
            </div>
        </div>
    );
};

export default EmailConfirmedPage;
