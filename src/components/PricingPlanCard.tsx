"use client";

import { CheckBadgeIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
    checkFreeTrialStatus,
    checkSubscriptionStatus,
    fetchSupabaseUser,
} from "@/lib/supabase/queries";
import { createClient } from "@/lib/supabase/client";
import { startUserFreeTrial } from "@/lib/supabase/admin";
import DefaultButton from "./DefaultButton";
import { toast } from "sonner";
import { FreeTrialStatus } from "@/enums/FreeTrialStatus";
import { FreeTrial } from "@/interfaces/FreeTrial";
import { formatDateToHumanFormat } from "@/lib/helper/formatDateToHumanFormat";
import { increaseDate } from "@/lib/helper/increaseDate";
import { SubscriptionStatus } from "@/enums/SubscriptionStatus";
import { Product } from "@/interfaces/Product";
import { PurchasedSubscription } from "@/interfaces/PurchasedSubscription";

export const PricingPlanCard = (props: Product) => {
    const {
        stripe_price_id,
        stripe_purchase_link,
        is_highlighted,
        name,
        previous_price,
        current_price,
        description,
        additional_info,
        features,
    } = props;

    const [freeTrialStatus, setFreeTrialStatus] = useState<FreeTrialStatus | null>(null);
    const [freeTrialInfo, setFreeTrialInfo] = useState<FreeTrial | null>(null);

    const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
    const [subscriptionInfo, setSubscriptionInfo] = useState<PurchasedSubscription | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const searchParams = useSearchParams();
    const welcomeEmail = searchParams.get("welcomeEmail");

    const supabase = createClient();
    const router = useRouter();

    const startFreeTrial = async () => {
        setIsLoading(true);

        const { user } = await fetchSupabaseUser({ supabase });

        if (!user) return;

        const currentDate = new Date();

        let freeTrialEndDate;
        if (welcomeEmail === "true") {
            freeTrialEndDate = increaseDate({ date: currentDate, days: 14 });
        } else {
            freeTrialEndDate = increaseDate({ date: currentDate, days: 7 });
        }

        const { error: freeTrialError } = await startUserFreeTrial({
            supabase,
            userId: user.id,
            stripePriceId: stripe_price_id,
            freeTrialEndDate: freeTrialEndDate,
        });

        if (freeTrialError) {
            console.error("Error starting free trial", freeTrialError);
            setIsLoading(false);

            return toast.error("Error starting free trial");
        }

        setIsLoading(false);

        toast.success("Free Trial has been started");

        router.push("/");
    };

    useEffect(() => {
        const fetchSubscriptionStatus = async () => {
            const { user } = await fetchSupabaseUser({ supabase });

            if (!user) return;

            try {
                const [freeTrialResult, subscriptionResult] = await Promise.all([
                    checkFreeTrialStatus({ userId: user.id }),
                    checkSubscriptionStatus({ userId: user.id }),
                ]);

                setFreeTrialStatus(freeTrialResult.status);
                setFreeTrialInfo(freeTrialResult.freeTrial);
                setSubscriptionStatus(subscriptionResult.status);
                setSubscriptionInfo(subscriptionResult.subscription);
            } catch (error) {
                console.error("Error fetching subscription data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSubscriptionStatus();

        const intervalId = setInterval(fetchSubscriptionStatus, 5000);

        return () => clearInterval(intervalId);
    }, []);

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
                        title="Upgrade Now"
                        onClick={() => window.open(stripe_purchase_link)}
                        disabled={false}
                    />
                );
            }
        }

        return (
            <DefaultButton
                title={`Get Started Now (${is_highlighted ? "40" : "20"}% off)`}
                onClick={() => window.open(stripe_purchase_link, "_blank")}
            />
        );
    };

    const renderFreeTrialIndicator = () => {
        if (freeTrialStatus !== FreeTrialStatus.ACTIVE) return null;

        if (!freeTrialInfo?.end_date) return null;

        if (subscriptionInfo?.stripe_price_id !== stripe_price_id) return null;

        return (
            <div className="bg-black text-white text-sm px-2.5 py-0.5 rounded-md mb-4 text-center whitespace-nowrap">
                Free Trial End Date: {formatDateToHumanFormat(freeTrialInfo.end_date)}
            </div>
        );
    };

    return (
        <div
            className={`bg-white rounded-2xl shadow-lg border p-8 relative ${
                is_highlighted ? "border-black" : ""
            }`}
        >
            <div className="mb-6">
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    {renderFreeTrialIndicator()}
                </div>

                <h3 className="text-lg mb-6 font-medium">{name}</h3>

                <p className="text-gray-600 line-through font-medium">${previous_price}</p>

                <div className="mb-6">
                    <span className="text-3xl font-medium">${current_price}</span>
                    <span className="text-gray-600 ml-2">USD</span>
                </div>

                <p className="text-gray-600 text-sm mb-2">{description}</p>

                <p className="text-gray-600 text-sm mb-8">{additional_info}</p>

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
