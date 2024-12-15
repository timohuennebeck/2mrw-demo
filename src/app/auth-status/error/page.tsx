"use client";

import { StatusPage } from "@/app/auth-status/components/StatusPage";
import { ERROR_TYPES } from "@/config";
import { useSearchParams } from "next/navigation";

export default function StatusErrorPage() {
    const searchParams = useSearchParams();

    const errorType = searchParams.get("mode") ?? "unexpected-error";
    const config = ERROR_TYPES[errorType as keyof typeof ERROR_TYPES];

    return <StatusPage type="error" config={config} />;
}
