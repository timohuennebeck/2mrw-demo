"use client";

import { StatusPage } from "@/app/auth-status/components/StatusPage";
import { ERROR_TYPES } from "@/config";
import { redirect, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const StatusErrorPage = () => (
    <Suspense fallback={null}>
        <StatusErrorPageContent />
    </Suspense>
);

const StatusErrorPageContent = () => {
    const searchParams = useSearchParams();

    const errorType = searchParams.get("mode") ?? "unexpected-error";
    const config = ERROR_TYPES[errorType as keyof typeof ERROR_TYPES];

    if (!config) return redirect("/auth-status/error?mode=unexpected-error");

    return <StatusPage type="error" config={config} />;
};

export default StatusErrorPage;
