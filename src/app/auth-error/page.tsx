"use client";

import { Button } from "@/components/ui/button";
import { Manrope } from "next/font/google";
import { useRouter, useSearchParams } from "next/navigation";

const manrope = Manrope({
    subsets: ["latin"],
    variable: "--font-manrope",
});

const ERROR_TYPES = {
    "token-expired": {
        badge: "LINK ERROR",
        title: "Link",
        highlight: "Has Expired",
        description:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae expedita obcaecati modi, nisi reiciendis mollitia!",
        primaryButton: {
            href: "/auth/sign-in?method=magic-link",
            label: "Request New Link",
        },
    },
    "email-update": {
        badge: "UPDATE ERROR",
        title: "Email Update",
        highlight: "Failed",
        description:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae expedita obcaecati modi, nisi reiciendis mollitia!",
        primaryButton: {
            href: "/dashboard/user-profile",
            label: "Back to Profile",
        },
    },
    "create-user": {
        badge: "DATABASE ERROR",
        title: "User",
        highlight: "Creation Failed",
        description:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae expedita obcaecati modi, nisi reiciendis mollitia!",
        primaryButton: {
            href: "/auth/sign-in?method=magic-link",
            label: "Try Again",
        },
    },
    "google-auth": {
        badge: "GOOGLE ERROR",
        title: "Google Sign-in",
        highlight: "Failed",
        description:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae expedita obcaecati modi, nisi reiciendis mollitia!",
        primaryButton: {
            href: "/auth/sign-in?method=magic-link",
            label: "Back to Sign In",
        },
    },
    default: {
        badge: "ERROR",
        title: "Unexpected",
        highlight: "Error",
        description:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae expedita obcaecati modi, nisi reiciendis mollitia!",
        primaryButton: {
            href: "/auth/sign-in?method=magic-link",
            label: "Back to Sign In",
        },
    },
};

export default function AuthErrorPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const errorType = searchParams.get("type") || "default";
    const error = ERROR_TYPES[errorType as keyof typeof ERROR_TYPES] || ERROR_TYPES.default;

    return (
        <>
            <div className="fixed inset-0 -z-10 h-full w-full">
                <div className="h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
            </div>

            <div
                className={`${manrope.variable} flex min-h-screen flex-col items-center justify-center px-4 font-manrope`}
            >
                <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
                    <span className="mb-4 text-sm font-medium text-blue-600">{error.badge}</span>
                    <h1 className="mb-4 text-4xl font-medium tracking-tight sm:text-5xl">
                        {error.title}{" "}
                        <span className="mt-4 inline-block bg-blue-600 p-2 text-white">
                            {error.highlight}
                        </span>
                    </h1>
                    <p className="mb-8 text-base text-muted-foreground">{error.description}</p>
                    <div className="flex w-full max-w-md flex-col gap-4">
                        <Button
                            size="lg"
                            className="w-full"
                            onClick={() => router.replace(error.primaryButton.href)}
                        >
                            {error.primaryButton.label}
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => router.replace("/")}
                            className="w-full"
                        >
                            Return to Homepage
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
