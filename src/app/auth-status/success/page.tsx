"use client";

import { StatusPage } from "@/app/auth-status/components/StatusPage";
import { SUCCESS_TYPES } from "@/config";
import { redirect, useSearchParams } from "next/navigation";

export default function StatusSuccessPage() {
    const searchParams = useSearchParams();

    const successType = searchParams.get("mode");
    if (!successType) return redirect("/auth-status/error?mode=unexpected-error");

    const config = SUCCESS_TYPES[successType as keyof typeof SUCCESS_TYPES];

    return <StatusPage type="success" config={config} />;
}
