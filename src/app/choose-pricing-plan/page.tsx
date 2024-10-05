"use client";

import { PricingPlanCard } from "@/components/PricingPlan/PricingPlanCard";
import SignOutButton from "@/components/SignOutButton";
import TestimonialBackground from "@/components/TestimonialBackground";
import { PricingPlanCardSkeleton } from "@/components/ui/PricingPlanCardSkeleton";
import { TextConstants } from "@/constants/TextConstants";
import { useSubscriptionFreeTrialStatus } from "@/hooks/useSubscriptionFreeTrialStatus";
import { Product } from "@/interfaces/ProductInterfaces";
import { fetchProducts } from "@/services/supabase/queries";
import { useQuery } from "@tanstack/react-query";

const ChoosePricingPlanPage = () => {
    const { data: products } = useQuery({
        queryKey: ["products"],
        queryFn: () => fetchProducts(),
        staleTime: 5 * 60 * 1000,
    });

    const subscriptionFreeTrialStatus = useSubscriptionFreeTrialStatus();

    return (
        <TestimonialBackground>
            <div className="flex flex-col gap-6 w-full">
                <div className="self-start">
                    <SignOutButton title={TextConstants.TEXT__LOGOUT} />
                </div>

                <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2">
                    {subscriptionFreeTrialStatus.isLoading
                        ? [1, 2].map((_, index) => <PricingPlanCardSkeleton key={index} />)
                        : products?.products?.map((product: Product, index) => (
                              <PricingPlanCard
                                  key={index}
                                  {...product}
                                  {...subscriptionFreeTrialStatus}
                                  supabaseUser={
                                      subscriptionFreeTrialStatus.supabaseUser?.user ?? null
                                  }
                              />
                          ))}
                </div>
            </div>
        </TestimonialBackground>
    );
};

export default ChoosePricingPlanPage;
