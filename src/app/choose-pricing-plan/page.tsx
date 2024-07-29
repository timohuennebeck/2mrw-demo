"use client";

import { PricingPlanCard } from "@/components/PricingPlan/PricingPlanCard";
import SignOutButton from "@/components/SignOutButton";
import { PricingPlanCardSkeleton } from "@/components/ui/PricingPlanCardSkeleton";
import { TextConstants } from "@/constants/TextConstants";
import { Product } from "@/interfaces/ProductInterfaces";
import { fetchProducts, fetchSupabaseUser } from "@/services/supabase/queries";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useState } from "react";

const ChoosePricingPlanPage = () => {
    const [showSkeleton, setShowSkeleton] = useState(true);

    const { data: products } = useQuery({
        queryKey: ["products"],
        queryFn: () => fetchProducts(),
        staleTime: 5 * 60 * 1000,
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowSkeleton(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="absolute top-8 right-8">
                <SignOutButton title="Sign out" />
            </div>

            <div className="p-8 max-w-4xl w-full">
                <div className="flex justify-center mb-6">
                    <Image
                        src={process.env.NEXT_PUBLIC_EMAIL_LOGO_BASE_URL ?? ""}
                        alt="Logo"
                        width={48}
                        height={48}
                    />
                </div>

                <h1 className="text-2xl font-semibold text-center mb-2">Choose a Plan</h1>
                <p className="text-center text-gray-600 mb-8 text-sm">
                    Choose a plan to start using {TextConstants.TEXT__COMPANY_TITLE}. This is a
                    one-time purchase not a subscription. You can still upgrade your plan later if
                    needed.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {showSkeleton ? (
                        <>
                            {[1, 2].map((_, index) => (
                                <PricingPlanCardSkeleton key={index} />
                            ))}
                        </>
                    ) : (
                        products?.products?.map((product: Product, index) => (
                            <PricingPlanCard key={index} {...product} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChoosePricingPlanPage;
