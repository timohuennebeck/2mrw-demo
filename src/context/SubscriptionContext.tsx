import { createContext, useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchUserSubscription } from "@/services/database/subscriptionService";
import { useSession } from "./SessionContext";
import { PurchasedSubscription } from "@/interfaces";
import { SubscriptionStatus } from "@/enums";

interface SubscriptionContextType {
    subscription: PurchasedSubscription | null;
    subscriptionStatus: SubscriptionStatus;
    invalidateSubscription: () => void;
    isLoading: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
    subscription: null,
    subscriptionStatus: SubscriptionStatus.EXPIRED,
    invalidateSubscription: () => {},
    isLoading: false,
});

export const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
    const queryClient = useQueryClient();

    const { authUser } = useSession();

    const { data, isFetching } = useQuery({
        queryKey: ["subscription"],
        queryFn: () => fetchUserSubscription(authUser?.id ?? ""),
        enabled: !!authUser?.id,
    });

    const invalidateSubscription = () => {
        queryClient.invalidateQueries({ queryKey: ["subscription", authUser?.id] });
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
