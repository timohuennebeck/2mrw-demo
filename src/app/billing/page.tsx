"use client";

import DashboardLayout from "../DashboardLayout";
import BillingPortal from "@/components/Billing/BillingPortal";
import CurrentSubscriptionPlan from "@/components/Billing/CurrentSubscriptionPlan";
import ChangeSubscriptionPlan from "@/components/Billing/ChangeSubscriptionPlan";
import HeaderWithDescription from "@/components/HeaderWithDescription";
import { useSession } from "@/context/SessionContext";
import { hasUserPremiumOrFreeTrial } from "@/lib/helper/subscriptionHelper";

const BillingPage = () => {
    const { user } = useSession();

    const hasPremiumOrFreeTrial = hasUserPremiumOrFreeTrial(user);

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
