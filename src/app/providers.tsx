"use client";

import * as React from "react";
import { SessionProvider } from "@/context/SessionContext";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/qClient/qClient";
import { UserProvider } from "@/context/UserContext";
import { SubscriptionProvider } from "@/context/SubscriptionContext";
import { FreeTrialProvider } from "@/context/FreeTrialContext";
import { ReferralProvider } from "@/context/ReferralContext";

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <SessionProvider>
                <UserProvider>
                    <SubscriptionProvider>
                        <FreeTrialProvider>
                            <ReferralProvider>
                                {children}
                            </ReferralProvider>
                        </FreeTrialProvider>
                    </SubscriptionProvider>
                </UserProvider>
            </SessionProvider>
        </QueryClientProvider>
    );
};
