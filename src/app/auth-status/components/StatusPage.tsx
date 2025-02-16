"use client";

import { Button } from "@/components/ui/button";
import { Manrope } from "next/font/google";
import { useRouter } from "next/navigation";
import { StatusPageProps } from "../authStatus";
import { useEffect, useState } from "react";
import TexturedBackground from "@/components/ui/textured-background";

const manrope = Manrope({
    subsets: ["latin"],
    variable: "--font-manrope",
});

export function StatusPage({ type = "error", config }: StatusPageProps) {
    const router = useRouter();

    const [timer, setTimer] = useState(30);

    const statusColor = type === "error" ? "text-red-600" : "text-blue-600";
    const statusBgColor = type === "error" ? "bg-red-600" : "bg-blue-600";

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    router.push(config.primaryButton.href);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [router, config.primaryButton.href]);

    return (
        <>
            <TexturedBackground />

            <div
                className={`${manrope.variable} flex min-h-screen flex-col items-center justify-center px-4 font-manrope`}
            >
                <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-8 text-center">
                    <div className="flex flex-col items-center gap-4">
                        <span className={`text-sm font-medium ${statusColor}`}>{config.badge}</span>
                        <h1 className="text-4xl font-medium tracking-tight sm:text-5xl">
                            {config.title}{" "}
                            <span className={`mt-4 inline-block ${statusBgColor} p-2 text-white`}>
                                {config.highlight}
                            </span>
                        </h1>
                        <p className="text-base text-muted-foreground">{config.description}</p>
                    </div>
                    <div className="flex w-full max-w-md flex-col gap-4">
                        <Button
                            size="lg"
                            className="w-full"
                            onClick={() => router.replace(config.primaryButton.href)}
                        >
                            {config.primaryButton.label}
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
                    <p className="text-center text-sm text-gray-400">
                        You will be redirected in {timer} seconds...
                    </p>
                </div>
            </div>
        </>
    );
}
