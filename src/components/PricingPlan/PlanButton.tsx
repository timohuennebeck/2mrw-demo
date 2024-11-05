import { FreeTrialStatus } from "@/enums/FreeTrialStatus";
import { SubscriptionStatus } from "@/enums/SubscriptionStatus";
import { PurchasedSubscription } from "@/interfaces/SubscriptionInterfaces";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import CustomButton from "../CustomButton";
import { initiateStripeCheckoutProcess } from "@/lib/stripe/stripeUtils";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { createClient } from "@/services/integration/client";
import moment from "moment";
import { TextConstants } from "@/constants/TextConstants";
import { getCurrentPaymentSettings } from "@/config/paymentConfig";
import { queryClient } from "@/lib/qClient/qClient";
import { EmailTemplate } from "@/lib/email/emailService";
import axios from "axios";
import { startUserFreeTrial } from "@/services/database/FreeTrialService";
import { increaseDate } from "@/lib/helper/DateHelper";

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

    const handleCheckout = async () => {
        try {
            setIsLoading(true);

            const { checkoutUrl } = await initiateStripeCheckoutProcess({
                userEmail: supabaseUser?.email ?? "",
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

    const startFreeTrial = async () => {
        setIsLoading(true);

        const freeTrialEndDate = increaseDate({
            date: moment(),
            days: getCurrentPaymentSettings().freeTrialDays,
        }).toISOString();

        try {
            await startUserFreeTrial({
                userId: supabaseUser?.id ?? "",
                stripePriceId: stripePriceId,
                freeTrialEndDate,
            });

            await supabase.auth.updateUser({
                data: {
                    free_trial_status: FreeTrialStatus.ACTIVE,
                    free_trial_end_date: freeTrialEndDate,
                },
            });

            const { data: userData, error: userError } = await supabase
                .from("users")
                .select("first_name, email")
                .eq("id", supabaseUser?.id)
                .single();

            if (userError) {
                console.error("Failed to fetch user data for email:", userError);
            } else {
                try {
                    await axios.post("/api/email-services", {
                        template: EmailTemplate.FREE_TRIAL,
                        userEmail: userData.email,
                        userFirstName: userData.first_name,
                        freeTrialEndDate: moment(freeTrialEndDate).format("MMMM D, YYYY"),
                    });
                } catch (emailError) {
                    console.error("Failed to send free trial email:", emailError);
                }
            }

            queryClient.invalidateQueries({
                queryKey: ["freeTrial", supabaseUser?.id],
            });

            toast.success(TextConstants.TEXT__FREE_TRIAL_STARTED);
            router.push("/");
        } catch (error) {
            toast.error(TextConstants.ERROR__STARTING_FREE_TRIAL);
        } finally {
            setIsLoading(false);
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
            !freeTrialStatus &&
            getCurrentPaymentSettings().enableFreeTrial
        ) {
            const freeTrialDuration = getCurrentPaymentSettings().freeTrialDays;
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

    return <CustomButton {...determineButtonProps()} className="w-full" />;
};
