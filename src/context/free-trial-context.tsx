import { isFreeTrialEnabled } from "@/config";
import { FreeTrialStatus } from "@/enums";
import { FreeTrial } from "@/interfaces/models/free-trial.model";
import { fetchUserFreeTrial } from "@/services/database/free-trial-service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext } from "react";
import { useSession } from "./session-context";
import { CACHE_KEYS } from "@/constants/caching-constants";

interface FreeTrialContextType {
    freeTrial: FreeTrial | null;
    canStartFreeTrial: boolean;
    isOnFreeTrial: boolean;
    invalidateFreeTrial: () => Promise<void>;
    isLoading: boolean;
}

const FreeTrialContext = createContext({
    freeTrial: null,
    canStartFreeTrial: false,
    isOnFreeTrial: false,
    invalidateFreeTrial: async () => {},
    isLoading: false,
} as FreeTrialContextType);

export const FreeTrialProvider = ({ children }: { children: React.ReactNode }) => {
    const { authUser } = useSession();

    const queryClient = useQueryClient();

    const { data: freeTrial, isFetching } = useQuery({
        queryKey: CACHE_KEYS.USER_CRITICAL.FREE_TRIAL(authUser?.id ?? ""),
        queryFn: () => fetchUserFreeTrial(authUser?.id ?? ""),
        enabled: !!authUser?.id,
    });

    const isOnFreeTrial = freeTrial?.data && freeTrial?.data.status === FreeTrialStatus.ACTIVE;
    const canStartFreeTrial = isFreeTrialEnabled() && !freeTrial?.data;

    return (
        <FreeTrialContext.Provider
            value={{
                freeTrial: freeTrial?.data,
                canStartFreeTrial,
                isOnFreeTrial,
                invalidateFreeTrial: async () => {
                    await queryClient.invalidateQueries({
                        queryKey: CACHE_KEYS.USER_CRITICAL.FREE_TRIAL(authUser?.id ?? ""),,
                        refetchType: "active",
                    });
                },
                isLoading: isFetching,
            }}
        >
            {children}
        </FreeTrialContext.Provider>
    );
};

export const useFreeTrial = () => useContext(FreeTrialContext);
