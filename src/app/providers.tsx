"use client";

import * as React from "react";
import { ProductsProvider } from "@/context/ProductsContext";
import { SessionProvider, useSession } from "@/context/SessionContext";
import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/qClient/qClient";
import { fetchUserSubscription } from "@/services/database/SubscriptionService";
import { fetchUser } from "@/services/database/UserService";

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <SessionProvider>
                <ProductsProvider>
                    <PreloaderWrapper>{children}</PreloaderWrapper>
                </ProductsProvider>
            </SessionProvider>
        </QueryClientProvider>
    );
};

const PreloaderWrapper = ({ children }: { children: React.ReactNode }) => {
    const { authUserIsLoggedIn, authUser } = useSession();

    useEffect(() => {
        const fetchInitialInformation = async () => {
            if (!authUserIsLoggedIn || !authUser) return;

            try {
                await Promise.all([
                    queryClient.prefetchQuery({
                        queryKey: ["subscription", authUser.id],
                        queryFn: () => fetchUserSubscription(authUser.id),
                    }),
                    queryClient.prefetchQuery({
                        queryKey: ["user", authUser.id],
                        queryFn: () => fetchUser(authUser.id),
                    }),
                ]);
            } catch (error) {
                console.error("Error fetching initial data:", error);
            }
        };

        fetchInitialInformation();
    }, [authUserIsLoggedIn, authUser]);

    return children;
};
