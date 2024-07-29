import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FreeTrialStatus } from "@/enums/FreeTrialStatus";
import { SubscriptionStatus } from "@/enums/SubscriptionStatus";
import { FreeTrial } from "@/interfaces/FreeTrial";
import { PurchasedSubscription } from "@/interfaces/SubscriptionInterfaces";
import {
    checkFreeTrialStatus,
    checkPurchasedSubscriptionStatus,
    fetchSupabaseUser,
} from "@/services/supabase/queries";

export function useSubscriptionFreeTrialStatus() {
    const queryClient = useQueryClient();

    const { data: user } = useQuery({
        queryKey: ["supabaseUser"],
        queryFn: () => fetchSupabaseUser(),
        staleTime: 5 * 60 * 1000,
        initialData: () => queryClient.getQueryData(["supabaseUser"]),
    });

    const { data: freeTrialData, isFetching: isFreeTrialLoading } = useQuery({
        queryKey: ["freeTrialStatus", { userId: user?.user?.id ?? "" }],
        queryFn: () => checkFreeTrialStatus({ userId: user?.user?.id ?? "" }),
        enabled: !!user?.user?.id,
    });

    const { data: subscriptionData, isLoading: isSubscriptionLoading } = useQuery({
        queryKey: ["subscriptionStatus", { userId: user?.user?.id ?? "" }],
        queryFn: () => checkPurchasedSubscriptionStatus({ userId: user?.user?.id ?? "" }),
        enabled: !!user?.user?.id,
    });

    const isLoading = !user || isFreeTrialLoading || isSubscriptionLoading;

    return {
        freeTrialStatus: freeTrialData?.status as FreeTrialStatus,
        freeTrialInfo: freeTrialData?.freeTrial as FreeTrial,
        subscriptionStatus: subscriptionData?.status as SubscriptionStatus,
        subscriptionInfo: subscriptionData?.subscription as PurchasedSubscription,
        isLoading,
        supabaseUser: user,
    };
}
