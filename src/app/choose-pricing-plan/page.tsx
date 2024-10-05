"use client";

import { PricingPlanCard } from "@/components/PricingPlan/PricingPlanCard";
import SignOutButton from "@/components/SignOutButton";
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
        <div className="flex min-h-screen items-center justify-center overflow-hidden">
            <div className="absolute right-8 top-8">
                <SignOutButton title="Sign out" />
            </div>

            <div className="h-full w-full max-w-4xl">
                <h1 className="mb-2 text-center text-2xl font-medium">Choose a Plan</h1>
                <div className="flex justify-center">
                    <p className="mb-8 w-3/4 text-center text-sm text-neutral-500">
                        Choose a plan to start using {TextConstants.TEXT__COMPANY_TITLE}. This is a
                        one-time purchase not a subscription. You can still upgrade Your plan later
                        if needed.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
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
