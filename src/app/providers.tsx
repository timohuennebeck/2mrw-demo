"use client";

import { SessionProvider } from "@/context/SessionContext";
import useUserInfoPreloader from "@/hooks/useUserInfoPreloader";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const Providers = ({ children }: { children: React.ReactNode }) => {
    useUserInfoPreloader(); // loads initial data once the user is logged in

    return (
        <SessionProvider>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </SessionProvider>
    );
};
