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
    invalidateFreeTrial: () => Promise<void>;
    isLoading: boolean;
}

const FreeTrialContext = createContext<FreeTrialContextType>({
    freeTrial: null,
    canStartFreeTrial: false,
    isOnFreeTrial: false,
    invalidateFreeTrial: async () => {},
    isLoading: false,
});

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
