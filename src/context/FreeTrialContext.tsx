import { createContext, useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "./SessionContext";
import { FreeTrialStatus } from "@/enums";
import { billingConfig } from "@/config";
import { fetchUserFreeTrial } from "@/services/database/freeTrialService";
import { FreeTrial } from "@/interfaces/models/freeTrial";

interface FreeTrialContextType {
    freeTrial: FreeTrial | null;
    canStartFreeTrial: boolean;
    isOnFreeTrial: boolean;
    invalidateFreeTrial: () => void;
    isLoading: boolean;
}

const FreeTrialContext = createContext<FreeTrialContextType>({
    freeTrial: null,
    canStartFreeTrial: false,
    isOnFreeTrial: false,
    invalidateFreeTrial: () => {},
    isLoading: false,
});

export const FreeTrialProvider = ({ children }: { children: React.ReactNode }) => {
    const queryClient = useQueryClient();
    const { authUser } = useSession();

    const { data, isFetching } = useQuery({
        queryKey: ["free_trials", authUser?.id],
        queryFn: () => fetchUserFreeTrial(authUser?.id ?? ""),
        enabled: !!authUser?.id,
    });

    const invalidateFreeTrial = () => {
        queryClient.invalidateQueries({ queryKey: ["free-trial", authUser?.id] });
    };

    const freeTrial = data?.data;
    const isOnFreeTrial = freeTrial?.status === FreeTrialStatus.ACTIVE;
    const canStartFreeTrial = billingConfig.freeTrial.isEnabled && !freeTrial;

    return (
        <FreeTrialContext.Provider
            value={{
                freeTrial,
                canStartFreeTrial,
                isOnFreeTrial,
                invalidateFreeTrial,
                isLoading: isFetching,
            }}
        >
            {children}
        </FreeTrialContext.Provider>
    );
};

export const useFreeTrial = () => useContext(FreeTrialContext);
