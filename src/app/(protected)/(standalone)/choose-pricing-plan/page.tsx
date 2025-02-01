"use client";

import PricingCard from "@/components/marketing/pricing-card";
import { isFreePlanEnabled, isOneTimePaymentEnabled } from "@/config";
import { useSession } from "@/context/SessionContext";
import { useSubscription } from "@/context/SubscriptionContext";
import { getFilteredPricingPlans } from "@/services/domain/pricingService";
import { Manrope } from "next/font/google";

const manrope = Manrope({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

const ChoosePricingPlanPage = () => {
    const { authUser } = useSession();
    const { subscription } = useSubscription();

    const showFreePlan = isFreePlanEnabled();
    const isOneTimePayment = isOneTimePaymentEnabled();

    const filteredPlans = getFilteredPricingPlans();
    const plansToShow = isOneTimePayment ? filteredPlans.oneTime : filteredPlans.monthly;

    return (
        <>
            <div className="fixed inset-0 -z-10 h-full w-full">
                <div className="h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
            </div>
            <div
                className={`flex min-h-screen w-full items-center justify-center px-8 py-16 ${manrope.className}`}
            >
                <div className="container max-w-7xl">
                    <div
                        className={`mb-12 flex flex-col gap-6 ${showFreePlan ? "text-start" : "items-center text-center"}`}
                    >
                        <p className="text-sm font-medium text-blue-600">Lorem, ipsum.</p>
                        <h2 className="max-w-4xl text-4xl font-medium leading-tight tracking-tight md:text-5xl">
                            <>
                                Lorem ipsum dolor sit{" "}
                                <span className="relative mt-4 inline-block whitespace-nowrap bg-blue-600 p-2 text-white">
                                    amet consectetur,
                                </span>
                                adipisicing elit.
                            </>
                        </h2>
                        <p className="max-w-4xl text-lg text-gray-600">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.
                        </p>
                    </div>

                    <div
                        className={`grid gap-8 ${
                            showFreePlan ? "md:grid-cols-3" : "mx-auto max-w-[882px] md:grid-cols-2"
                        }`}
                    >
                        {plansToShow.map((plan, index) => (
                            <PricingCard
                                key={`${plan.name}-${index}`}
                                plan={plan}
                                features={getFilteredPricingPlans().pricingCardFeatures}
                                isUserLoggedIn={!!authUser}
                                currentPlanStripePriceId={subscription?.stripe_price_id ?? ""}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChoosePricingPlanPage;
