"use client";

import { PricingPlanCard } from "@/components/PricingPlan/PricingPlanCard";
import { PricingPlanCardSkeleton } from "@/components/ui/PricingPlanCardSkeleton";
import { useFreeTrial } from "@/hooks/useFreeTrial";
import { useSubscription } from "@/hooks/useSubscription";
import { ProductWithPrices } from "@/interfaces/ProductInterfaces";
import { useState } from "react";
import { isFreePlanEnabled, isOneTimePaymentEnabled, paymentConfig } from "@/config/paymentConfig";
import { TextConstants } from "@/constants/TextConstants";
import { useProducts } from "@/context/ProductsContext";
import { useSession } from "@/context/SessionContext";
import { SubscriptionInterval } from "@/interfaces/StripePrices";
import { SubscriptionTier } from "@/enums/SubscriptionTier";
import BillingPlanSkeleton from "@/components/ui/BillingPlanSkeleton";

const ChoosePricingPlanPage = () => {
    const [billingCycle, setBillingCycle] = useState<SubscriptionInterval>(
        SubscriptionInterval.MONTHLY,
    );

    const { products } = useProducts();
    const { authUser } = useSession();

    const userId = authUser?.id;

    const {
        status: freeTrialStatus,
        freeTrial: freeTrialData,
        isLoading: isFreeTrialLoading,
    } = useFreeTrial(userId ?? "");

    const {
        status: subscriptionStatus,
        subscription: subscriptionData,
        isLoading: isSubscriptionLoading,
    } = useSubscription(userId ?? "");

    const isLoading = isFreeTrialLoading || isSubscriptionLoading;

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

    return (
        <div className="flex h-full min-h-screen w-full items-center justify-center">
            <div className="container px-4 py-8">
                {!isOneTimePaymentEnabled() && (
                    <div className="mb-8 flex justify-center">
                        <div className="flex gap-2">
                            {!products || isLoading ? (
                                <>
                                    <BillingPlanSkeleton />
                                    <BillingPlanSkeleton isYearly />
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() =>
                                            setBillingCycle(SubscriptionInterval.MONTHLY)
                                        }
                                        className={`rounded px-3 py-1 text-sm ${
                                            billingCycle === SubscriptionInterval.MONTHLY
                                                ? "bg-neutral-900 text-white"
                                                : "bg-neutral-100"
                                        }`}
                                    >
                                        {TextConstants.TEXT__MONTHLY.toUpperCase()}
                                    </button>
                                    <button
                                        onClick={() => setBillingCycle(SubscriptionInterval.YEARLY)}
                                        className={`rounded px-3 py-1 text-sm ${
                                            billingCycle === SubscriptionInterval.YEARLY
                                                ? "bg-neutral-900 text-white"
                                                : "bg-neutral-100"
                                        }`}
                                    >
                                        {`${TextConstants.TEXT__YEARLY.toUpperCase()} (${paymentConfig.subscriptionSettings.yearlyDiscountPercentage}%)`}
                                    </button>
                                </>
                            )}
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
                    {!products || isLoading
                        ? isFreePlanEnabled()
                            ? [1, 2, 3].map((_, index) => <PricingPlanCardSkeleton key={index} />)
                            : [1, 2].map((_, index) => <PricingPlanCardSkeleton key={index} />)
                        : sortedProducts?.map((product: ProductWithPrices, index) => (
                              <PricingPlanCard
                                  key={index}
                                  {...product}
                                  freeTrialStatus={freeTrialStatus}
                                  freeTrialData={freeTrialData}
                                  subscriptionStatus={subscriptionStatus}
                                  subscriptionData={subscriptionData}
                                  supabaseUser={authUser ?? null}
                                  isLoading={isLoading}
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
