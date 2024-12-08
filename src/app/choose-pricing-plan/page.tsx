"use client";

import PricingCards from "@/components/marketing/PricingCards";
import { defaultPricingPlans, pricingCardFeatures } from "@/data/marketing/pricing-data";
import { Manrope } from "next/font/google";

const manrope = Manrope({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

const ChoosePricingPlanPage = () => {
    return (
        <>
            <div className="fixed inset-0 -z-10 h-full w-full">
                <div className="h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
            </div>
            <div
                className={`flex min-h-screen w-full items-center justify-center px-8 py-16 ${manrope.className}`}
            >
                <div className="container max-w-7xl">
                    <div className="mb-12 flex flex-col gap-6 text-start">
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
                    <PricingCards
                        plans={defaultPricingPlans}
                        features={pricingCardFeatures}
                        buttonText="Select Plan"
                    />
                </div>
            </div>
        </>
    );
};

export default ChoosePricingPlanPage;
