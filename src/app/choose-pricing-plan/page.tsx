"use client";

import { PricingPlanCard } from "@/components/PricingPlanCard/PricingPlanCard";
import { PricingPlanCardSkeleton } from "@/components/ui/PricingPlanCardSkeleton";
import { useState } from "react";
import { isFreePlanEnabled, isOneTimePaymentEnabled } from "@/config/paymentConfig";
import { TextConstants } from "@/constants/TextConstants";
import { useProducts } from "@/context/ProductsContext";
import { useSession } from "@/context/SessionContext";
import { useSubscription } from "@/context/SubscriptionContext";
import { ProductWithPrices } from "@/interfaces";
import { SubscriptionInterval, SubscriptionTier } from "@/enums";

const ChoosePricingPlanPage = () => {
    const [billingCycle, setBillingCycle] = useState<SubscriptionInterval>(
        SubscriptionInterval.MONTHLY,
    );

    const { products } = useProducts();
    const { authUser } = useSession();

    const {
        subscriptionStatus,
        subscription: subscriptionData,
        isLoading: isSubscriptionLoading,
    } = useSubscription();

    const productsOrder = [
        SubscriptionTier.FREE,
        SubscriptionTier.ESSENTIALS,
        SubscriptionTier.FOUNDERS,
    ];

    const sortedProducts = products?.sort((a, b) => {
        return (
            productsOrder.indexOf(a.subscription_tier) - productsOrder.indexOf(b.subscription_tier)
        );
    });

    const getSubscriptionIntervalText = (interval: SubscriptionInterval) => {
        return interval === SubscriptionInterval.YEARLY
            ? `${TextConstants.TEXT__YEARLY.toUpperCase()}`
            : `${TextConstants.TEXT__MONTHLY.toUpperCase()}`;
    };

    const SubscriptionIntervalButton = ({ interval }: { interval: SubscriptionInterval }) => (
        <button
            onClick={() => setBillingCycle(interval)}
            className={`rounded px-3 py-1 text-sm ${
                billingCycle === interval ? "bg-neutral-900 text-white" : "bg-neutral-100"
            }`}
        >
            {getSubscriptionIntervalText(interval)}
        </button>
    );

    return (
        <div className="flex h-full min-h-screen w-full items-center justify-center">
            <div className="container px-4 py-8">
                {!isOneTimePaymentEnabled() && (
                    <div className="mb-8 flex justify-center">
                        <div className="flex gap-2">
                            <SubscriptionIntervalButton interval={SubscriptionInterval.MONTHLY} />
                            <SubscriptionIntervalButton interval={SubscriptionInterval.YEARLY} />
                        </div>
                    </div>
                )}
                <div
                    className={`mx-auto grid w-full grid-cols-1 gap-8 ${
                        isFreePlanEnabled()
                            ? "max-w-8xl md:grid-cols-3"
                            : "max-w-6xl md:grid-cols-2"
                    }`}
                >
                    {!products || isSubscriptionLoading
                        ? isFreePlanEnabled()
                            ? [1, 2, 3].map((_, index) => <PricingPlanCardSkeleton key={index} />)
                            : [1, 2].map((_, index) => <PricingPlanCardSkeleton key={index} />)
                        : sortedProducts?.map((product: ProductWithPrices, index) => (
                              <PricingPlanCard
                                  key={index}
                                  {...product}
                                  subscriptionStatus={subscriptionStatus}
                                  subscriptionData={subscriptionData}
                                  supabaseUser={authUser ?? null}
                                  isLoading={isSubscriptionLoading}
                                  billingCycle={billingCycle}
                                  setBillingCycle={setBillingCycle}
                              />
                          ))}
                </div>
            </div>
        </div>
    );
};

export default ChoosePricingPlanPage;
