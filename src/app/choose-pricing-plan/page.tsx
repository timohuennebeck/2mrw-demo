"use client";

import { PricingPlanCard } from "@/components/PricingPlan/PricingPlanCard";
import { PricingPlanCardSkeleton } from "@/components/ui/PricingPlanCardSkeleton";
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
        <div className="flex h-full min-h-screen w-full items-center justify-center">
            <div className="container px-4 py-8">
                <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
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
        </div>
    );
};

export default ChoosePricingPlanPage;
