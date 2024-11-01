import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchUserFreeTrial } from "@/services/supabase/queries";
import { FreeTrialStatus } from "@/enums/FreeTrialStatus";
import { FreeTrial } from "@/interfaces/FreeTrial";

export const useFreeTrial = (userId: string) => {
    const queryClient = useQueryClient();

    const { data: freeTrial, isLoading } = useQuery({
        queryKey: ["freeTrial", userId],
        queryFn: () => fetchUserFreeTrial(userId ?? ""),
        enabled: !!userId,
    });

    const invalidateFreeTrial = () => {
        queryClient.invalidateQueries({ queryKey: ["freeTrial", userId] });
    };

    return {
        status: freeTrial?.freeTrial?.status as FreeTrialStatus,
        freeTrial: freeTrial?.freeTrial as FreeTrial,
        isLoading,
        invalidateFreeTrial,
    };
};

export default useFreeTrial;
