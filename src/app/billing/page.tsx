"use client";

import DashboardLayout from "../DashboardLayout";
import BillingPortal from "@/components/Billing/BillingPortal";
import CurrentSubscriptionPlan from "@/components/Billing/CurrentSubscriptionPlan";
import ChangeSubscriptionPlan from "@/components/Billing/ChangeSubscriptionPlan";
import HeaderWithDescription from "@/components/HeaderWithDescription";
import { useSession } from "@/context/SessionContext";
import { hasUserPremiumOrFreeTrial } from "@/lib/helper/subscriptionHelper";
import { useSubscription } from "@/hooks/useSubscription";
import { useFreeTrial } from "@/hooks/useFreeTrial";
import { useSupabaseRealtime } from "@/hooks/useSupabaseRealtime";

const BillingPage = () => {
    const { authUser } = useSession();
    const { invalidateSubscription } = useSubscription(authUser?.id ?? "");
    const { invalidateFreeTrial } = useFreeTrial(authUser?.id ?? "");

    const hasPremiumOrFreeTrial = hasUserPremiumOrFreeTrial(authUser);

    useSupabaseRealtime({
        table: "purchased_subscriptions",
        filter: `user_id=eq.${authUser?.id}`,
        onChange: invalidateSubscription,
    });

    useSupabaseRealtime({
        table: "free_trials",
        filter: `user_id=eq.${authUser?.id}`,
        onChange: invalidateFreeTrial,
    });

    return (
        <DashboardLayout>
            <div className="container max-w-3xl bg-white">
                <HeaderWithDescription
                    title="Billing"
                    description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur, itaque!"
                    isPageHeader
                />

                <div className="flex flex-col gap-6">
                    <BillingPortal />
                    {hasPremiumOrFreeTrial && <CurrentSubscriptionPlan />}
                    <ChangeSubscriptionPlan />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default BillingPage;
