"use client";

import DashboardLayout from "../DashboardLayout";
import BillingPortal from "@/components/Billing/BillingPortal";
import CurrentSubscriptionPlan from "@/components/Billing/CurrentSubscriptionPlan";
import ChangeSubscriptionPlan from "@/components/Billing/ChangeSubscriptionPlan";
import HeaderWithDescription from "@/components/HeaderWithDescription";

const BillingPage = () => {
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

                    <CurrentSubscriptionPlan />

                    <ChangeSubscriptionPlan />
                </div>
            </div>
        </DashboardLayout>
    );
};

export default BillingPage;
