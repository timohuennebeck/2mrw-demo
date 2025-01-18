import { createContext, useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchUserSubscription } from "@/services/database/subscriptionService";
import { useSession } from "./SessionContext";
import { PurchasedSubscription } from "@/interfaces";
import { SubscriptionStatus } from "@/enums";

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
        queryKey: ["subscription", authUser?.id],
        queryFn: () => fetchUserSubscription(authUser?.id ?? ""),
        enabled: !!authUser?.id,
    });

    const invalidateSubscription = async () => {
        await queryClient.invalidateQueries({
            queryKey: ["subscription", authUser?.id],
            refetchType: "active",
        });
    };

    return (
        <SubscriptionContext.Provider
            value={{
                subscription: data?.data ?? null,
                subscriptionStatus: data?.data?.status as SubscriptionStatus,
                invalidateSubscription,
                isLoading: isFetching,
            }}
        >
            {children}
        </SubscriptionContext.Provider>
    );
};

export const useSubscription = () => useContext(SubscriptionContext);
