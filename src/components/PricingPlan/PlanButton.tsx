import { FreeTrialStatus } from "@/enums/FreeTrialStatus";
import { SubscriptionStatus } from "@/enums/SubscriptionStatus";
import { PurchasedSubscription } from "@/interfaces/SubscriptionInterfaces";
import { increaseDate } from "@/lib/helper/increaseDate";
import { startUserFreeTrial } from "@/services/supabase/admin";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import CustomButton from "../CustomButton";
import { initiateStripeCheckoutProcess } from "@/lib/stripe/stripeUtils";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { createClient } from "@/services/supabase/client";
import moment from "moment";
import { TextConstants } from "@/constants/TextConstants";
import { getCurrentPaymentSettings } from "@/config/paymentConfig";
import { emailConfig } from "@/config/emailConfig";

interface PlanButton {
    stripePriceId: string;
    freeTrialStatus: FreeTrialStatus | null;
    subscriptionStatus: SubscriptionStatus | null;
    subscriptionData: PurchasedSubscription;
    isLoading: boolean;
    supabaseUser: User | null;
    name: string;
}

export const PlanButton = ({
    stripePriceId,
    freeTrialStatus,
    subscriptionStatus,
    subscriptionData,
    isLoading: dataIsLoading,
    supabaseUser,
    name,
}: PlanButton) => {
    const supabase = createClient();

    const [isLoading, setIsLoading] = useState(dataIsLoading);

    useEffect(() => {
        setIsLoading(dataIsLoading);
    }, [dataIsLoading]);

    const router = useRouter();
    const searchParams = useSearchParams();
    const welcomeEmail = searchParams.get("welcomeEmail");

    const handleCheckout = async () => {
        try {
            setIsLoading(true);

            const { checkoutUrl } = await initiateStripeCheckoutProcess({
                userId: supabaseUser?.id ?? "",
                userEmail: supabaseUser?.email ?? "",
                stripePriceId: stripePriceId,
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

    const startFreeTrial = async () => {
        const freeTrialEndDate = increaseDate({
            date: moment(),
            days:
                welcomeEmail === "true"
                    ? emailConfig.settings.freeTrialEmail.freeTrialDuration
                    : getCurrentPaymentSettings().freeTrialDays,
        });

        try {
            await startUserFreeTrial({
                userId: supabaseUser?.id ?? "",
                stripePriceId: stripePriceId,
                freeTrialEndDate,
            });

            await supabase.auth.updateUser({
                data: {
                    free_trial_status: FreeTrialStatus.ACTIVE,
                    free_trial_end_date: moment().toISOString(),
                },
            });

            toast.success(TextConstants.TEXT__FREE_TRIAL_STARTED);
            router.push("/");
        } catch (error) {
            toast.error(TextConstants.ERROR__STARTING_FREE_TRIAL);
        }
    };

    const determineButtonProps = () => {
        const hasPurchasedSubscription = subscriptionStatus === SubscriptionStatus.ACTIVE;

        const baseProps = {
            disabled: isLoading,
            isLoading,
        };

        if (
            !hasPurchasedSubscription &&
            freeTrialStatus === null &&
            getCurrentPaymentSettings().enableFreeTrial
        ) {
            const freeTrialDuration =
                welcomeEmail === "true" ? 14 : getCurrentPaymentSettings().freeTrialDays;
            return {
                ...baseProps,
                title: `${TextConstants.TEXT__START_FREE_TRIAL} (${freeTrialDuration} ${TextConstants.TEXT__DAYS})`,
                onClick: startFreeTrial,
            };
        }

        if (hasPurchasedSubscription) {
            return subscriptionData?.stripe_price_id === stripePriceId
                ? { title: TextConstants.TEXT__CURRENT_PLAN, disabled: true }
                : { ...baseProps, title: TextConstants.TEXT__CHANGE_PLAN, onClick: handleCheckout };
        }

        return {
            ...baseProps,
            title: `${TextConstants.TEXT__UNLOCK} ${name}`,
            onClick: handleCheckout,
        };
    };

    return <CustomButton {...determineButtonProps()} />;
};
