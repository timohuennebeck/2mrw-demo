import { CheckBadgeIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { StripeSubscriptionPlan } from "@/interfaces/StripeSubscriptionPlan";
import ExternalButton from "./ExternalButton";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { checkFreeTrialStatus, checkSubscriptionStatus } from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/client";
import { startUserFreeTrial, updateUserSubscriptionStatus } from "@/utils/supabase/admin";
import DefaultButton from "./DefaultButton";
import { toast } from "sonner";
import { FreeTrialStatus } from "@/app/enums/FreeTrialStatus";
import { FreeTrial } from "@/interfaces/FreeTrial";
import { Subscription } from "@/interfaces/Subscription";
import { formatDateToHumanFormat } from "@/helper/formatDateToHumanFormat";
import { increaseDate } from "@/helper/increaseDate";
import { SubscriptionStatus } from "@/app/enums/SubscriptionStatus";

export const PricingPlanCard = ({
    name,
    description,
    additionalInfo,
    previousPrice,
    price,
    stripePaymentLink,
    stripePriceId,
    buttonCta,
    features,
    isHighlighted,
}: StripeSubscriptionPlan) => {
    const [freeTrialStatus, setFreeTrialStatus] = useState<FreeTrialStatus | null>(null);
    const [freeTrialInfo, setFreeTrialInfo] = useState<FreeTrial | null>(null);

    const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
    const [subscriptionInfo, setSubscriptionInfo] = useState<Subscription | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const searchParams = useSearchParams();
    const welcomeEmail = searchParams.get("welcomeEmail");

    const supabase = createClient();
    const router = useRouter();

    const fetchUser = async () => {
        // TODO: this causes a 406, not acceptable error
        const {
            data: { user },
            error,
        } = await supabase.auth.getUser();

        if (error) {
            console.error("Error fetching user:", error);
            throw error;
        }

        if (!user) {
            console.log("There is no logged in user");
            throw new Error("There is no logged in user");
        }

        return user;
    };

    const startFreeTrial = async () => {
        setIsLoading(true);
        const user = await fetchUser();

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
            freeTrialEndDate: freeTrialEndDate,
        });

        const { error: subscriptionError } = await updateUserSubscriptionStatus({
            supabase,
            hasPremium: true,
            stripePriceId: stripePriceId,
            userId: user.id,
        });

        if (freeTrialError) {
            console.error("Error starting free trial", freeTrialError);
            setIsLoading(false);

            return toast.error("Error starting free trial");
        }

        if (subscriptionError) {
            console.error("Error updating subscription", subscriptionError);

            setIsLoading(false);
        }

        setIsLoading(false);

        toast.success("Free Trial has been started");

        router.push("/");
    };

    useEffect(() => {
        const getUserFreeTrialStatus = async () => {
            try {
                const user = await fetchUser();
                const {
                    status: freeTrialStatus,
                    freeTrial,
                    error,
                } = await checkFreeTrialStatus({
                    userId: user.id,
                });

                const { status: subscriptionStatus, subscription } = await checkSubscriptionStatus({
                    userId: user.id,
                });

                if (error) {
                    toast.error("Error checking free trial status");
                    setFreeTrialStatus(FreeTrialStatus.ERROR);
                } else {
                    setFreeTrialStatus(freeTrialStatus);
                    setFreeTrialInfo(freeTrial);
                    setSubscriptionStatus(subscriptionStatus);
                    setSubscriptionInfo(subscription);
                }
            } catch (error) {
                console.error("Error in getUserFreeTrialStatus:", error);

                setFreeTrialStatus(FreeTrialStatus.ERROR);
                setSubscriptionStatus(SubscriptionStatus.ERROR);
            }
        };

        getUserFreeTrialStatus();
    }, []);

    const renderSubscriptionButtons = () => {
        if (freeTrialStatus === null || subscriptionStatus === null) {
            return <DefaultButton title="Loading..." disabled={true} />;
        }

        if (freeTrialStatus === FreeTrialStatus.NOT_STARTED) {
            return (
                <DefaultButton
                    onClick={startFreeTrial}
                    title={`Start Free Trial (${welcomeEmail === "true" ? "14" : "7"} Days)`}
                    disabled={isLoading}
                />
            );
        }

        const hasOnGoingFreeTrial = freeTrialStatus === FreeTrialStatus.ACTIVE;
        const hasPurchasedSubscription = subscriptionStatus === SubscriptionStatus.ACTIVE;

        if (!hasOnGoingFreeTrial && hasPurchasedSubscription) {
            const isCurrentPlan = subscriptionInfo?.stripe_price_id === stripePriceId;

            // dont show this on a free trial
            // because we want to give users the option to purchase a paid plan during the free trial
            if (isCurrentPlan) {
                return <DefaultButton title="Current Plan" disabled={true} />;
            } else {
                return <DefaultButton title="Upgrade Now" onClick={() => {}} disabled={false} />;
            }
        }

        return (
            <DefaultButton
                title={buttonCta}
                onClick={() => window.open(stripePaymentLink, "_blank")}
            />
        );
    };

    const renderFreeTrialIndicator = () => {
        if (freeTrialStatus !== FreeTrialStatus.ACTIVE) return null;

        if (!freeTrialInfo?.end_date) return null;

        if (subscriptionInfo?.stripe_price_id !== stripePriceId) return null;

        return (
            <div className="bg-black text-white text-sm px-2.5 py-0.5 rounded-md mb-4 text-center whitespace-nowrap">
                Free Trial End Date: {formatDateToHumanFormat(freeTrialInfo.end_date)}
            </div>
        );
    };

    return (
        <div
            className={`bg-white rounded-2xl shadow-lg border p-8 relative ${
                isHighlighted ? "border-black" : ""
            }`}
        >
            <div className="mb-6">
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                    {renderFreeTrialIndicator()}
                </div>

                <h3 className="text-lg mb-6 font-medium">{name}</h3>

                <p className="text-gray-600 line-through font-medium">${previousPrice}</p>

                <div className="mb-6">
                    <span className="text-3xl font-medium">${price}</span>
                    <span className="text-gray-600 ml-2">USD</span>
                </div>

                <p className="text-gray-600 text-sm mb-2">{description}</p>

                <p className="text-gray-600 text-sm mb-8">{additionalInfo}</p>

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
