"use client";

import { Button } from "@/components/ui/button";
import { TextConstants } from "@/constants/TextConstants";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const ConfirmationPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const mode = searchParams.get("mode");
    const [timer, setTimer] = useState(5);

    const getConfirmationContent = () => {
        switch (mode) {
            case "email-confirmed":
                return {
                    title: "Email Confirmed!",
                    description: `Your email has been confirmed. You can now continue using ${TextConstants.TEXT__COMPANY_TITLE}.`,
                    redirectPath: "/choose-pricing-plan",
                    buttonText: "Continue",
                };
            case "google-connected":
                return {
                    title: "Google Has Been Connected!",
                    description: `Your Google account has been connected. You can now continue using ${TextConstants.TEXT__COMPANY_TITLE}.`,
                    redirectPath: "/dashboard",
                    buttonText: "Continue to Dashboard",
                };
            case "password-updated":
                return {
                    title: "Password Updated!",
                    description: `Your password has been updated. You can now continue using ${TextConstants.TEXT__COMPANY_TITLE}.`,
                    redirectPath: "/dashboard",
                    buttonText: "Continue to Dashboard",
                };
            case "email-updated":
                return {
                    title: "Email Updated!",
                    description: `Your email has been updated. You can now continue using ${TextConstants.TEXT__COMPANY_TITLE}.`,
                    redirectPath: "/dashboard/user-profile",
                    buttonText: "Continue to Profile",
                };
            default:
                return {
                    title: "Success!",
                    description: "The operation has been completed successfully.",
                    redirectPath: "/dashboard",
                    buttonText: "Continue",
                };
        }
    };

    const content = getConfirmationContent();

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    router.push(content.redirectPath);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [router, content.redirectPath]);

    return (
        <div className="flex h-screen items-center justify-center">
            <div className="flex w-full flex-col gap-6">
                <div className="flex items-center gap-2">
                    <Image
                        src="https://framerusercontent.com/images/XmxX3Fws7IH91jzhxBjAhC9CrPM.svg"
                        alt="logo"
                        width={40}
                        height={40}
                    />
                </div>

                <div>
                    <h1 className="mb-2 text-2xl font-semibold">{content.title}</h1>
                    <p className="text-sm text-gray-500">{content.description}</p>
                </div>

                <Button onClick={() => router.push(content.redirectPath)} className="w-full">
                    {content.buttonText}
                </Button>

                <p className="text-center text-sm text-gray-400">
                    You will be redirected in {timer} seconds...
                </p>
            </div>
        </div>
    );
};

export default ConfirmationPage;
