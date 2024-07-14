import { CheckBadgeIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { StripeSubscriptionPlan } from "@/interfaces/StripeSubscriptionPlan";
import ExternalButton from "./ExternalButton";
import { redirect, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { checkFreeTrialStatus } from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/client";
import { startUserFreeTrial, updateUserSubscriptionStatus } from "@/utils/supabase/admin";
import DefaultButton from "./DefaultButton";
import { toast } from "sonner";

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
    const [hasCompletedFreeTrial, setHasCompletedFreeTrial] = useState(false);

    // when a user has starts a free trial then also update the following fields in the subscriptions table
    // stripe_price_id, subscription_plan, and has_premium

    const searchParams = useSearchParams();
    const welcomeEmail = searchParams.get("welcomeEmail");

    const supabase = createClient();

    const fetchUser = async () => {
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

    const increaseDate = ({ date, days }: { date: Date; days: number }) => {
        let result = new Date(date);
        result.setDate(result.getDate() + days);

        return result;
    };

    const startFreeTrial = async () => {
        const user = await fetchUser();

        if (!hasCompletedFreeTrial) {
            const currentDate = new Date();

            let freeTrialEndDate;
            if (welcomeEmail === "true") {
                freeTrialEndDate = increaseDate({ date: currentDate, days: 7 });
            } else {
                freeTrialEndDate = increaseDate({ date: currentDate, days: 14 });
            }

            const { error } = await startUserFreeTrial({
                userId: user.id,
                freeTrialEndDate: freeTrialEndDate,
            });

            if (error) {
                return toast.error("Error starting free trial");
            }

            toast.success("Free trial has been started");

            // this seems to fail
            updateUserSubscriptionStatus({
                hasPremium: true,
                stripePriceId: stripePriceId,
                userId: user.id,
            });

            // redirect("/");
        }
    };

    useEffect(() => {
        const getUserFreeTrialStatus = async () => {
            try {
                const user = await fetchUser();
                const { freeTrial } = await checkFreeTrialStatus({ userId: user.id });

                setHasCompletedFreeTrial(!!freeTrial);
            } catch (error) {
                console.error("Error in getUserFreeTrialStatus:", error);

                setHasCompletedFreeTrial(false);
            }
        };

        getUserFreeTrialStatus();
    }, []);

    return (
        <div
            className={`bg-white rounded-2xl shadow-lg border p-8 ${
                isHighlighted ? "border-black" : ""
            }`}
        >
            <div className="mb-6">
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

            {hasCompletedFreeTrial ? (
                <ExternalButton title={buttonCta} href={stripePaymentLink} />
            ) : (
                <DefaultButton
                    onClick={startFreeTrial}
                    title={`Start Free Trial (${welcomeEmail === "true" ? "14" : "7"} Days)`}
                />
            )}

            <p className="text-center text-sm text-gray-600 mt-4">Purchase Once. Forever Yours.</p>
        </div>
    );
};
