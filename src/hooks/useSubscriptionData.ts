// hooks/useSubscriptionData.ts
"use client";

import { useState, useEffect } from "react";
import {
    checkFreeTrialStatus,
    checkPurchasedSubscriptionStatus,
    fetchSupabaseUser,
} from "@/services/supabase/queries";
import { FreeTrialStatus } from "@/enums/FreeTrialStatus";
import { SubscriptionStatus } from "@/enums/SubscriptionStatus";
import { FreeTrial } from "@/interfaces/FreeTrial";
import { PurchasedSubscription } from "@/interfaces/SubscriptionInterfaces";

export function useSubscriptionData() {
    const [freeTrialStatus, setFreeTrialStatus] = useState<FreeTrialStatus | null>(null);
    const [freeTrialInfo, setFreeTrialInfo] = useState<FreeTrial | null>(null);

    const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
    const [subscriptionInfo, setSubscriptionInfo] = useState<PurchasedSubscription | null>(null);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSubscriptionStatus = async () => {
            const { user } = await fetchSupabaseUser();

            if (!user) return;

            try {
                const [freeTrialResult, subscriptionResult] = await Promise.all([
                    checkFreeTrialStatus({ userId: user.id }),
                    checkPurchasedSubscriptionStatus({ userId: user.id }),
                ]);

                setFreeTrialStatus(freeTrialResult.status);
                setFreeTrialInfo(freeTrialResult.freeTrial);
                setSubscriptionStatus(subscriptionResult.status);
                setSubscriptionInfo(subscriptionResult.subscription);
            } catch (error) {
                console.error("Error fetching subscription data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSubscriptionStatus();

        // const intervalId = setInterval(fetchSubscriptionStatus, 5000);

        // return () => clearInterval(intervalId);
    }, []);

    return { freeTrialStatus, freeTrialInfo, subscriptionStatus, subscriptionInfo, isLoading };
}
