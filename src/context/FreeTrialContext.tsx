import { isFreeTrialEnabled } from "@/config";
import { FreeTrialStatus } from "@/enums";
import { FreeTrial } from "@/interfaces/models/free-trial.model";
import { fetchUserFreeTrial } from "@/services/database/freeTrialService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useContext } from "react";
import { useSession } from "./SessionContext";

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

    const { data, isFetching } = useQuery({
        queryKey: ["free_trial", authUser?.id],
        queryFn: () => fetchUserFreeTrial(authUser?.id ?? ""),
        enabled: !!authUser?.id,
    });

    const invalidateFreeTrial = async () => {
        await queryClient.invalidateQueries({
            queryKey: ["free_trial", authUser?.id],
            refetchType: "active",
        });
    };

    const freeTrial = data?.data;
    const isOnFreeTrial = freeTrial?.status === FreeTrialStatus.ACTIVE;
    const canStartFreeTrial = isFreeTrialEnabled() && !freeTrial;

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
