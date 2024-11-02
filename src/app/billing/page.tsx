"use client";

import DashboardLayout from "../DashboardLayout";
import BillingPortal from "@/components/Billing/BillingPortal";
import CurrentSubscriptionPlan from "@/components/Billing/CurrentSubscriptionPlan";
import ChangeSubscriptionPlan from "@/components/Billing/ChangeSubscriptionPlan";
import HeaderWithDescription from "@/components/HeaderWithDescription";
import useSubscription from "@/hooks/useSubscription";
import { useSession } from "@/context/SessionContext";
import useFreeTrial from "@/hooks/useFreeTrial";
import { SubscriptionStatus } from "@/enums/SubscriptionStatus";
import { FreeTrialStatus } from "@/enums/FreeTrialStatus";

const BillingPage = () => {
    const { user } = useSession();
    const { subscription } = useSubscription(user?.id ?? "");
    const { freeTrial } = useFreeTrial(user?.id ?? "");

    const hasPlan =
        subscription?.status === SubscriptionStatus.ACTIVE ||
        freeTrial?.status === FreeTrialStatus.ACTIVE;

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

                    {hasPlan && <CurrentSubscriptionPlan />}

                    <ChangeSubscriptionPlan />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default BillingPage;
