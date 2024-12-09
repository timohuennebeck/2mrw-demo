"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export const SearchParamsHandler = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const hasShownToastRef = useRef(false);

    useEffect(() => {
        const message = searchParams.get("message");
        if (message === "email-updated" && !hasShownToastRef.current) {
            hasShownToastRef.current = true;
            setTimeout(() => {
                toast.success("Your email has been updated");
            }, 100);
            router.replace("/user-profile", { scroll: false });
        }
    }, [searchParams, router]);

    return null;
};
