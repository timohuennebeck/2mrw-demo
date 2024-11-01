import { useQuery } from "@tanstack/react-query";
import { fetchUserFreeTrial } from "@/services/supabase/queries";
import { FreeTrialStatus } from "@/enums/FreeTrialStatus";
import { FreeTrial } from "@/interfaces/FreeTrial";

export const useFreeTrial = (userId: string) => {
    const { data: freeTrial, isLoading } = useQuery({
        queryKey: ["freeTrial", userId],
        queryFn: () => fetchUserFreeTrial(userId ?? ""),
        enabled: !!userId,
    });

    return {
        status: freeTrial?.freeTrial?.status as FreeTrialStatus,
        freeTrial: freeTrial?.freeTrial as FreeTrial,
        isLoading,
    };
};

export default useFreeTrial;
