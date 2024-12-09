"use client";

import * as React from "react";
import { SessionProvider } from "@/context/SessionContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/qClient/qClient";
import { UserProvider } from "@/context/UserContext";
import { SubscriptionProvider } from "@/context/SubscriptionContext";

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <SessionProvider>
                <UserProvider>
                    <SubscriptionProvider>
                        {children}
                    </SubscriptionProvider>
                </UserProvider>
            </SessionProvider>
        </QueryClientProvider>
    );
};
