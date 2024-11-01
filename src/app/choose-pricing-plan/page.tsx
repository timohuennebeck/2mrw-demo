"use client";

import { PricingPlanCard } from "@/components/PricingPlan/PricingPlanCard";
import { PricingPlanCardSkeleton } from "@/components/ui/PricingPlanCardSkeleton";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import { useFreeTrial } from "@/hooks/useFreeTrial";
import { useSubscription } from "@/hooks/useSubscription";
import { Product } from "@/interfaces/ProductInterfaces";
import { fetchProducts } from "@/services/supabase/queries";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { isOneTimePaymentEnabled, paymentConfig } from "@/config/paymentConfig";
import { TextConstants } from "@/constants/TextConstants";

const ChoosePricingPlanPage = () => {
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

    const { data: user, isLoading: isUserLoading } = useSupabaseUser();
    const userId = user?.user?.id;

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

    const { data: products } = useQuery({
        queryKey: ["products"],
        queryFn: () => fetchProducts(),
        staleTime: 5 * 60 * 1000,
    });

    const isLoading = isUserLoading || isFreeTrialLoading || isSubscriptionLoading;

    return (
        <div className="flex h-full min-h-screen w-full items-center justify-center">
            <div className="container px-4 py-8">
                {!isOneTimePaymentEnabled() && (
                    <div className="mb-8 flex justify-center">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setBillingCycle("monthly")}
                                className={`rounded px-3 py-1 text-sm ${
                                    billingCycle === "monthly"
                                        ? "bg-neutral-900 text-white"
                                        : "bg-neutral-100"
                                }`}
                            >
                                {TextConstants.TEXT__MONTHLY.toUpperCase()}
                            </button>
                            <button
                                onClick={() => setBillingCycle("yearly")}
                                className={`rounded px-3 py-1 text-sm ${
                                    billingCycle === "yearly"
                                        ? "bg-neutral-900 text-white"
                                        : "bg-neutral-100"
                                }`}
                            >
                                {`${TextConstants.TEXT__YEARLY.toUpperCase()} (${paymentConfig.subscriptionSettings.yearlyDiscountPercentage}%)`}
                            </button>
                        </div>
                    </div>
                )}
                <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
                    {isLoading
                        ? [1, 2].map((_, index) => <PricingPlanCardSkeleton key={index} />)
                        : products?.products?.map((product: Product, index) => (
                              <PricingPlanCard
                                  key={index}
                                  {...product}
                                  freeTrialStatus={freeTrialStatus}
                                  freeTrialData={freeTrialData}
                                  subscriptionStatus={subscriptionStatus}
                                  subscriptionData={subscriptionData}
                                  supabaseUser={user?.user ?? null}
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
