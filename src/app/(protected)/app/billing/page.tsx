"use client";

import CurrentSubscriptionPlan from "@/components/application/current-subscription-plan";
import { useFreeTrial } from "@/context/free-trial-context";
import { useSubscription } from "@/context/subscription-context";
import { useUser } from "@/context/user-context";
import { PurchasedSubscription } from "@/interfaces";
import { FreeTrial } from "@/interfaces/models/free-trial.model";
import { useEffect } from "react";

const BillingPage = () => {
    const { subscription, invalidateSubscription } = useSubscription();
    const { dbUser } = useUser();
    const { freeTrial } = useFreeTrial();

    useEffect(() => {
        invalidateSubscription();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex max-w-6xl flex-col gap-12">
            <CurrentSubscriptionPlan
                subscription={subscription as PurchasedSubscription}
                freeTrial={freeTrial as FreeTrial}
                stripeCustomerId={dbUser?.stripe_customer_id as string}
                currentPlanStripePriceId={subscription?.stripe_price_id as string}
            />
        </div>
    );
};

export default BillingPage;
