import { useQuery } from "@tanstack/react-query";
import { SubscriptionStatus } from "@/enums/SubscriptionStatus";
import { PurchasedSubscription } from "@/interfaces/SubscriptionInterfaces";
import { fetchSubscription } from "@/services/supabase/queries";

export const useSubscription = (userId: string) => {
    const { data, isLoading } = useQuery({
        queryKey: ["subscription", userId],
        queryFn: () => fetchSubscription(userId ?? ""),
        enabled: !!userId,
    });

    return {
        status: data?.subscription?.status as SubscriptionStatus,
        subscription: data?.subscription as PurchasedSubscription,
        isLoading,
    };
};

export default useSubscription;
