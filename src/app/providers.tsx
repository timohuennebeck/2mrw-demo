"use client";

import { ProductsProvider } from "@/context/ProductsContext";
import { SessionProvider } from "@/context/SessionContext";
import useUserInfoPreloader from "@/hooks/useUserInfoPreloader";
import { queryClient } from "@/lib/qClient/qClient";
import { QueryClientProvider } from "@tanstack/react-query";

export const Providers = ({ children }: { children: React.ReactNode }) => {
    useUserInfoPreloader(); // loads initial data once the user is logged in

    return (
        <QueryClientProvider client={queryClient}>
            <SessionProvider>
                <ProductsProvider>
                    {children}
                </ProductsProvider>
            </SessionProvider>
        </QueryClientProvider>
    );
};
