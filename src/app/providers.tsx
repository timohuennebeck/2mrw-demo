"use client";

import {
    checkFreeTrialStatus,
    checkPurchasedSubscriptionStatus,
    checkUserProductPreorderStatus,
    fetchProducts,
    fetchSupabaseUser,
} from "@/services/supabase/queries";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const Providers = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
        const fetchInitialInformation = async () => {
            try {
                const { user } = await queryClient.fetchQuery({
                    queryKey: ["supabaseUser"],
                    queryFn: () => fetchSupabaseUser(),
                    staleTime: 5 * 60 * 1000,
                });

                await Promise.all([
                    queryClient.prefetchQuery({
                        queryKey: ["products"],
                        queryFn: () => fetchProducts(),
                        staleTime: 5 * 60 * 1000,
                    }),
                    queryClient.prefetchQuery({
                        queryKey: ["freeTrialStatus", { userId: user?.id ?? "" }],
                        queryFn: () => checkFreeTrialStatus({ userId: user?.id ?? "" }),
                    }),
                    queryClient.prefetchQuery({
                        queryKey: ["subscriptionStatus", { userId: user?.id ?? "" }],
                        queryFn: () => checkPurchasedSubscriptionStatus({ userId: user?.id ?? "" }),
                    }),
                    queryClient.prefetchQuery({
                        queryKey: ["preOrderStatus", { userId: user?.id ?? "" }],
                        queryFn: () => checkUserProductPreorderStatus({ userId: user?.id ?? "" }),
                    }),
                ]);
            } catch (error) {
                console.error("Error fetching initial data:", error);
            }
        };

        fetchInitialInformation();
    }, []);

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
