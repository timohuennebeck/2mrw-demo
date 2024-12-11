"use client";

import CurrentSubscriptionPlan from "@/components/application/CurrentSubscriptionPlan";
import { Separator } from "@/components/ui/separator";
import { useSession } from "@/context/SessionContext";
import { useSubscription } from "@/context/SubscriptionContext";
import useSuccessParam from "@/hooks/useSuccessParam";
import { useSupabaseRealtime } from "@/hooks/useSupabaseRealtime";
import { Suspense, useState } from "react";

const SuccessHandler = ({ onSuccess }: { onSuccess: () => void }) => {
    useSuccessParam({
        onSuccess,
        redirectPath: "/billing",
    });
    return null;
};

interface BillingSectionProps {
    title: string;
    description: string;
    children: React.ReactNode;
}

const BillingSection = ({ title, description, children }: BillingSectionProps) => {
    return (
        <div className="flex flex-col gap-32 md:flex-row">
            <div className="md:w-2/5">
                <h2 className="text-sm font-semibold">{title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            </div>
            <div className="mr-20 md:w-3/5">{children}</div>
        </div>
    );
};

const BillingPage = () => {
    const { authUser } = useSession();
    const { invalidateSubscription } = useSubscription();

    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    useSupabaseRealtime({
        table: "user_subscriptions",
        filter: `user_id=eq.${authUser?.id}`,
        onChange: invalidateSubscription,
    });

    /**
     * the ChangeSubscriptionPlan component is only shown if the user has not yet purchased a plan (one-time or recurring)
     * and if he has not cancelled his recurring subscription
     * otherwise, it's hidden because once a user has purchased a OTP plan, he cannot change the plan
     */

    return (
        <>
            <Suspense fallback={null}>
                <SuccessHandler onSuccess={() => setShowSuccessPopup(true)} />
            </Suspense>

            <div className="flex max-w-6xl flex-col gap-12 bg-white">
                <BillingSection
                    title="Subscription Plans"
                    description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati, iste!"
                >
                    <CurrentSubscriptionPlan />
                </BillingSection>

                <Separator />

                <BillingSection
                    title="Invoices"
                    description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati, iste!"
                >
                    <div className="rounded-lg border p-6">
                        <p className="text-sm text-muted-foreground">
                            To request an invoice, please reach out to our support team at{" "}
                            <a
                                href="mailto:support@example.com"
                                className="text-primary hover:underline"
                            >
                                support@example.com
                            </a>
                        </p>
                    </div>
                </BillingSection>
            </div>
        </>
    );
};

export default BillingPage;
