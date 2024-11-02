"use client";

import { ProductsProvider } from "@/context/ProductsContext";
import { SessionProvider, useSession } from "@/context/SessionContext";
import { queryClient } from "@/lib/qClient/qClient";
import { fetchUserFreeTrial, fetchUserSubscription } from "@/services/supabase/queries";
import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <SessionProvider>
                <PreloaderWrapper>
                    <ProductsProvider>
                        {children}
                    </ProductsProvider>
                </PreloaderWrapper>
            </SessionProvider>
        </QueryClientProvider>
    );
};

const PreloaderWrapper = ({ children }: { children: React.ReactNode }) => {
    const { userIsLoggedIn, user } = useSession();

    useEffect(() => {
        const fetchInitialInformation = async () => {
            if (!userIsLoggedIn || !user) return;

            try {
                await Promise.all([
                    queryClient.prefetchQuery({
                        queryKey: ["freeTrial", user.id],
                        queryFn: () => fetchUserFreeTrial(user.id),
                    }),
                    queryClient.prefetchQuery({
                        queryKey: ["subscription", user.id],
                        queryFn: () => fetchUserSubscription(user.id),
                    }),
                ]);
            } catch (error) {
                console.error("Error fetching initial data:", error);
            }
        };

        fetchInitialInformation();
    }, [userIsLoggedIn, user]);

    return children;
};
