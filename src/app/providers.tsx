"use client";

import {
    checkFreeTrialStatus,
    checkPurchasedSubscriptionStatus,
    fetchProducts,
    fetchSupabaseUser,
} from "@/services/supabase/queries";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const Providers = ({ children }: { children: React.ReactNode }) => {
    const [queryClient] = useState(() => new QueryClient());

    const prefetchSupbaseUser = async () => {
        await queryClient.prefetchQuery({
            queryKey: ["supabaseUser"],
            queryFn: () => fetchSupabaseUser(),
            staleTime: 5 * 60 * 1000,
        });
    };

    const prefetchProducts = async () => {
        await queryClient.prefetchQuery({
            queryKey: ["products"],
            queryFn: () => fetchProducts(),
            staleTime: 5 * 60 * 1000,
        });
    };

    const prefetchSubscriptionInfo = async ({ userId }: { userId: string }) => {
        await queryClient.prefetchQuery({
            queryKey: ["subscriptionStatus"],
            queryFn: () => checkPurchasedSubscriptionStatus({ userId }),
        });

        await queryClient.prefetchQuery({
            queryKey: ["freeTrialStatus"],
            queryFn: () => checkFreeTrialStatus({ userId }),
        });
    };

    useEffect(() => {
        const fetchInitialInformation = async () => {
            const { user } = await fetchSupabaseUser();

            prefetchSupbaseUser();
            prefetchProducts();
            prefetchSubscriptionInfo({ userId: user?.id ?? "" });
        };

        fetchInitialInformation();
    }, [queryClient]);

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
