"use client";

import { FreeTrialStatus } from "@/enums/FreeTrialStatus";
import { SubscriptionStatus } from "@/enums/SubscriptionStatus";
import { useSubscriptionData } from "@/hooks/useSubscriptionData";
import { Product } from "@/interfaces/ProductInterfaces";
import { formatDateToHumanFormat } from "@/lib/helper/formatDateToHumanFormat";
import { increaseDate } from "@/lib/helper/increaseDate";
import { createFreeTrialTable } from "@/services/supabase/admin";
import { fetchSupabaseUser } from "@/services/supabase/queries";
import { CheckBadgeIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import DefaultButton from "./DefaultButton";

export const PricingPlanCard = (props: Product) => {
    const {
        stripe_price_id,
        stripe_purchase_link,
        is_highlighted,
        name,
        previous_price,
        current_price,
        description,
        features,
    } = props;

    const { freeTrialStatus, freeTrialInfo, subscriptionStatus, subscriptionInfo, isLoading } =
        useSubscriptionData();

    const searchParams = useSearchParams();
    const welcomeEmail = searchParams.get("welcomeEmail");

    const router = useRouter();

    const startFreeTrial = async () => {
        const { user } = await fetchSupabaseUser();

        if (!user) return;

        const currentDate = new Date();

        let freeTrialEndDate;
        if (welcomeEmail === "true") {
            freeTrialEndDate = increaseDate({ date: currentDate, days: 14 });
        } else {
            freeTrialEndDate = increaseDate({ date: currentDate, days: 7 });
        }

        const { error: freeTrialError } = await createFreeTrialTable({
            userId: user.id,
            stripePriceId: stripe_price_id,
            freeTrialEndDate: freeTrialEndDate,
        });

        if (freeTrialError) {
            console.error("Error starting free trial", freeTrialError);

            return toast.error("Error starting free trial");
        }

        toast.success("Free Trial has been started");

        router.push("/");
    };

    const renderSubscriptionButtons = () => {
        if (freeTrialStatus === null) {
            return (
                <DefaultButton
                    onClick={startFreeTrial}
                    title={`Start Free Trial (${welcomeEmail === "true" ? "14" : "7"} Days)`}
                    disabled={isLoading}
                    isLoading={isLoading}
                />
            );
        }

        const hasPurchasedSubscription = subscriptionStatus === SubscriptionStatus.ACTIVE;
        const isOnFreeTrial = freeTrialStatus === FreeTrialStatus.ACTIVE;

        if (hasPurchasedSubscription && !isOnFreeTrial) {
            const isCurrentPlan = subscriptionInfo?.stripe_price_id === stripe_price_id;
            // dont show this on a free trial
            // as we want to give users the option to upgrade to a paid plan during the free trial
            if (isCurrentPlan) {
                return <DefaultButton title="Current Plan" disabled={true} />;
            } else {
                return (
                    <DefaultButton
                        title="Get Started Now"
                        onClick={() => window.open(stripe_purchase_link)}
                        disabled={false}
                    />
                );
            }
        }

        return (
            <DefaultButton
                title="Upgrade Now"
                onClick={() => window.open(stripe_purchase_link)}
                disabled={false}
            />
        );
    };

    const getIndicatorText = () => {
        const isCurrentPlan = freeTrialInfo?.stripe_price_id === stripe_price_id;
        const isOnFreeTrial = freeTrialStatus === FreeTrialStatus.ACTIVE;

        if (isOnFreeTrial && isCurrentPlan && freeTrialInfo?.end_date) {
            return (
                <div className="bg-black text-white text-sm px-2.5 py-0.5 rounded-md mb-4 text-center whitespace-nowrap">
                    Free Trial End Date: {formatDateToHumanFormat(freeTrialInfo?.end_date)}
                </div>
            );
        }

        if (is_highlighted) {
            return (
                <div className="bg-black text-white text-sm px-2.5 py-0.5 rounded-md mb-4 text-center whitespace-nowrap">
                    Most Popular Option
                </div>
            );
        }

        return null;
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg border p-8 relative">
            <div className="mb-6">
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    {getIndicatorText()}
                </div>

                <h3 className="text-lg mb-6 font-medium">{name}</h3>

                <p className="text-gray-600 line-through font-medium">${previous_price}</p>

                <div className="mb-6">
                    <span className="text-3xl font-medium">${current_price}</span>
                    <span className="text-gray-600 ml-2">USD</span>
                </div>

                <p className="text-gray-600 text-sm mb-4">{description}</p>

                <ul className="flex flex-col gap-3 mb-10">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                            {feature.included ? (
                                <CheckBadgeIcon className="w-5 h-5 text-black" />
                            ) : (
                                <XMarkIcon className="w-5 h-5 text-gray-400" />
                            )}
                            <span
                                className={`text-sm ${
                                    feature.included ? "text-gray-600" : "text-gray-400"
                                }`}
                            >
                                {feature.name}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            {renderSubscriptionButtons()}

            <p className="text-center text-sm text-gray-600 mt-4">Purchase Once. Forever Yours.</p>
        </div>
    );
};
