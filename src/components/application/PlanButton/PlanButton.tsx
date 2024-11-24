import { useRouter } from "next/navigation";
import { toast } from "sonner";
import CustomButton from "../CustomButton/CustomButton";
import { useEffect, useState } from "react";
import { TextConstants } from "@/constants/TextConstants";
import { isFreePlanEnabled } from "@/config/paymentConfig";
import { queryClient } from "@/lib/qClient/qClient";
import { startFreePlan } from "@/services/database/subscriptionService";
import { initiateStripeCheckoutProcess } from "@/services/stripe/stripeService";
import { SubscriptionTier, SubscriptionStatus } from "@/enums";
import { PlanButtonParams } from "./PlanButton.interface";

export const PlanButton = ({
    stripePriceId,
    subscriptionTier,
    subscriptionStatus,
    subscriptionData,
    isLoading: dataIsLoading,
    supabaseUser,
    name,
}: PlanButtonParams) => {
    const [isLoading, setIsLoading] = useState(dataIsLoading);

    useEffect(() => {
        setIsLoading(dataIsLoading);
    }, [dataIsLoading]);

    const router = useRouter();

    const handleCheckout = async () => {
        try {
            setIsLoading(true);

            const { checkoutUrl } = await initiateStripeCheckoutProcess({
                stripePriceId: stripePriceId,
                successUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
                cancelUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/choose-pricing-plan`,
            });

            if (checkoutUrl) {
                window.location.href = checkoutUrl;
                setIsLoading(false);
            }
        } catch (error) {
            toast.error(TextConstants.ERROR__STRIPE_CHECKOUT);
        } finally {
            setIsLoading(false);
        }
    };

    const determineButtonProps = () => {
        const baseProps = {
            disabled: isLoading,
            isLoading,
        };

        // case I: free plan is enabled and user is not on a free plan
        const isEligibleForFreePlan = isFreePlanEnabled() && !subscriptionStatus;
        if (subscriptionTier === SubscriptionTier.FREE && isEligibleForFreePlan) {
            return {
                ...baseProps,
                title: TextConstants.TEXT__UNLOCK_FREE_PLAN,
                onClick: async () => {
                    setIsLoading(true);
                    await startFreePlan(supabaseUser?.id ?? "");

                    setTimeout(() => {
                        setIsLoading(false); // adds a small delay so the user doesn't see the loading state toggling off before navigating
                    }, 1000);

                    router.push("/?success=true"); // this is used to show the success popup

                    queryClient.invalidateQueries({
                        queryKey: ["subscription", supabaseUser?.id],
                    });
                },
            };
        }

        // case II: user has an active subscription
        const hasOnGoingSubscription = subscriptionStatus === SubscriptionStatus.ACTIVE;
        if (hasOnGoingSubscription) {
            const isCurrentPlan = subscriptionData?.stripe_price_id === stripePriceId;
            return isCurrentPlan
                ? { title: TextConstants.TEXT__CURRENT_PLAN, disabled: true }
                : { ...baseProps, title: TextConstants.TEXT__CHANGE_PLAN, onClick: handleCheckout };
        }

        // final case: user is not on a free plan and does not have an active subscription
        return {
            ...baseProps,
            title: `${TextConstants.TEXT__UNLOCK} ${name}`,
            onClick: handleCheckout,
        };
    };

    return <CustomButton {...determineButtonProps()} className="w-full" />;
};
