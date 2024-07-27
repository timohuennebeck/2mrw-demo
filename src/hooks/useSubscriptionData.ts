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

export function useSubscriptionData() {
    const queryClient = useQueryClient();

    const { data: user } = useQuery({
        queryKey: ["supabaseUser"],
        queryFn: fetchSupabaseUser,
        staleTime: 5 * 60 * 1000,
        initialData: () => queryClient.getQueryData(["supabaseUser"]),
    });

    const { data: freeTrialData, isLoading: isFreeTrialLoading } = useQuery({
        queryKey: ["freeTrialStatus"],
        queryFn: () => checkFreeTrialStatus({ userId: user?.user?.id ?? "" }),
        enabled: !!user?.user?.id,
        initialData: () => queryClient.getQueryData(["freeTrialStatus"]),
    });

    const { data: subscriptionData, isLoading: isSubscriptionLoading } = useQuery({
        queryKey: ["subscriptionStatus"],
        queryFn: () => checkPurchasedSubscriptionStatus({ userId: user?.user?.id ?? "" }),
        enabled: !!user?.user?.id,
        initialData: () => queryClient.getQueryData(["subscriptionStatus"]),
    });

    return {
        freeTrialStatus: freeTrialData?.status as FreeTrialStatus,
        freeTrialInfo: freeTrialData?.freeTrial as FreeTrial,
        subscriptionStatus: subscriptionData?.status as SubscriptionStatus,
        subscriptionInfo: subscriptionData?.subscription as PurchasedSubscription,
        isFreeTrialLoading,
        isSubscriptionLoading,
        supabaseUser: user,
    };
}
