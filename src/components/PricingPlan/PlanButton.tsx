import { FreeTrialStatus } from "@/enums/FreeTrialStatus";
import { SubscriptionStatus } from "@/enums/SubscriptionStatus";
import { PurchasedSubscription } from "@/interfaces/SubscriptionInterfaces";
import { increaseDate } from "@/lib/helper/increaseDate";
import { createFreeTrialTable } from "@/services/supabase/admin";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import CustomButton from "../CustomButton";
import { initiateStripeCheckoutProcess } from "@/lib/stripe/stripeUtils";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { createClient } from "@/services/supabase/client";

interface PlanButton {
    stripePriceId: string;
    freeTrialStatus: FreeTrialStatus | null;
    subscriptionStatus: SubscriptionStatus | null;
    subscriptionInfo: PurchasedSubscription;
    isLoading: boolean;
    supabaseUser: User | null;
}

export const PlanButton = ({
    stripePriceId,
    freeTrialStatus,
    subscriptionStatus,
    subscriptionInfo,
    isLoading: dataIsLoading,
    supabaseUser,
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
            setIsLoading(false);
        }
    };

    const startFreeTrial = async () => {
        const freeTrialEndDate = increaseDate({
            date: new Date(),
            days: welcomeEmail === "true" ? 14 : 7,
        });

        try {
            await createFreeTrialTable({
                userId: supabaseUser?.id ?? "",
                stripePriceId: stripePriceId,
                freeTrialEndDate,
            });

            await supabase.auth.updateUser({
                data: {
                    freeTrialStatus: FreeTrialStatus.ACTIVE,
                    lastStatusCheck: new Date(),
                },
            });

            toast.success("Free Trial has been started");
            router.push("/");
        } catch (error) {
            toast.error("Error starting free trial");
        }
    };

    const determineButtonProps = () => {
        const hasPurchasedSubscription = subscriptionStatus === SubscriptionStatus.ACTIVE;

        const baseProps = {
            disabled: isLoading,
            isLoading,
        };

        if (!hasPurchasedSubscription && freeTrialStatus === null) {
            const freeTrialDuration = welcomeEmail === "true" ? 14 : 7;
            return {
                ...baseProps,
                title: `Start Free Trial (${freeTrialDuration} Days)`,
                onClick: startFreeTrial,
            };
        }

        if (hasPurchasedSubscription) {
            return subscriptionInfo?.stripe_price_id === stripePriceId
                ? { title: "Current Plan", disabled: true }
                : { ...baseProps, title: "Get Started Now", onClick: handleCheckout };
        }

        return { ...baseProps, title: "Upgrade Now", onClick: handleCheckout };
    };

    return <CustomButton {...determineButtonProps()} />;
};
