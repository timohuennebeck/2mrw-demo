import { createContext, useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchUserSubscription } from "@/services/database/subscription-service";
import { useSession } from "./session-context";
import { PurchasedSubscription } from "@/interfaces";
import { SubscriptionStatus } from "@/enums";
import { CACHE_KEYS } from "@/constants/caching-constants";

interface SubscriptionContextType {
    subscription: PurchasedSubscription | null;
    subscriptionStatus: SubscriptionStatus;
    invalidateSubscription: () => Promise<void>;
    isLoading: boolean;
}

const SubscriptionContext = createContext({
    subscription: null,
    subscriptionStatus: SubscriptionStatus.EXPIRED,
    invalidateSubscription: async () => {},
    isLoading: false,
} as SubscriptionContextType);

export const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
    const { authUser } = useSession();

    const queryClient = useQueryClient();

    const { data, isFetching } = useQuery({
        queryKey: CACHE_KEYS.USER_CRITICAL.SUBSCRIPTION(authUser?.id ?? ""),
        queryFn: () => fetchUserSubscription(authUser?.id ?? ""),
        enabled: !!authUser?.id,
    });

    return (
        <SubscriptionContext.Provider
            value={{
                subscription: data?.data ?? null,
                subscriptionStatus: data?.data?.status as SubscriptionStatus,
                invalidateSubscription: async () => {
                    await queryClient.invalidateQueries({
                        queryKey: CACHE_KEYS.USER_CRITICAL.SUBSCRIPTION(authUser?.id ?? ""),
                        refetchType: "active",
                    });
                },
                isLoading: isFetching,
            }}
        >
            {children}
        </SubscriptionContext.Provider>
    );
};

export const useSubscription = () => useContext(SubscriptionContext);
