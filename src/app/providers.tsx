"use client";

import * as React from "react";
import { SessionProvider } from "@/context/session-context";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/qClient/qClient";
import { UserProvider } from "@/context/user-context";
import { SubscriptionProvider } from "@/context/subscription-context";
import { FreeTrialProvider } from "@/context/free-trial-context";
import { ReferralProvider } from "@/context/referral-context";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <ReactQueryDevtools initialIsOpen={false} />
            <SessionProvider>
                <UserProvider>
                    <SubscriptionProvider>
                        <FreeTrialProvider>
                            <ReferralProvider>{children}</ReferralProvider>
                        </FreeTrialProvider>
                    </SubscriptionProvider>
                </UserProvider>
            </SessionProvider>
        </QueryClientProvider>
    );
};
