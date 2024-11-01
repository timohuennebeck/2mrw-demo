import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SubscriptionStatus } from "@/enums/SubscriptionStatus";
import { PurchasedSubscription } from "@/interfaces/SubscriptionInterfaces";
import { fetchUserSubscription } from "@/services/supabase/queries";

export const useSubscription = (userId: string) => {
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ["subscription", userId],
        queryFn: () => fetchUserSubscription(userId ?? ""),
        enabled: !!userId,
    });

    const invalidateSubscription = () => {
        queryClient.invalidateQueries({ queryKey: ["subscription", userId] });
    };

    return {
        status: data?.subscription?.status as SubscriptionStatus,
        subscription: data?.subscription as PurchasedSubscription,
        isLoading,
        invalidateSubscription,
    };
};

export default useSubscription;
