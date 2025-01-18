"use client";

import CurrentSubscriptionPlan from "@/components/application/current-subscription-plan";
import { useFreeTrial } from "@/context/FreeTrialContext";
import { useSubscription } from "@/context/SubscriptionContext";
import { useUser } from "@/context/UserContext";
import { PurchasedSubscription } from "@/interfaces";
import { FreeTrial } from "@/interfaces/models/freeTrial";

const BillingPage = () => {
    const { subscription } = useSubscription();
    const { dbUser } = useUser();
    const { freeTrial } = useFreeTrial();

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
