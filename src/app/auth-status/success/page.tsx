"use client";

import { StatusPage } from "@/app/auth-status/components/StatusPage";
import { SUCCESS_TYPES } from "@/config";
import { redirect, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const StatusSuccessPage = () => (
    <Suspense fallback={null}>
        <StatusSuccessPageContent />
    </Suspense>
);

const StatusSuccessPageContent = () => {
    const searchParams = useSearchParams();

    const successType = searchParams.get("mode");
    if (!successType) return redirect("/auth-status/error?mode=unexpected-error");

    const config = SUCCESS_TYPES[successType as keyof typeof SUCCESS_TYPES];

    if (!config) return redirect("/auth-status/error?mode=unexpected-error");

    return <StatusPage type="success" config={config} />;
};

export default StatusSuccessPage;
