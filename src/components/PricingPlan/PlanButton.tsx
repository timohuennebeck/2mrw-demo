import { FreeTrialStatus } from "@/enums/FreeTrialStatus";
import { SubscriptionStatus } from "@/enums/SubscriptionStatus";
import { PurchasedSubscription } from "@/interfaces/SubscriptionInterfaces";
import { increaseDate } from "@/lib/helper/increaseDate";
import { createFreeTrialTable } from "@/services/supabase/admin";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import CustomButton from "../CustomButton";

interface PlanButton {
    stripePriceId: string;
    stripePurchaseLink: string;
    freeTrialStatus: FreeTrialStatus | null;
    subscriptionStatus: SubscriptionStatus | null;
    subscriptionInfo: PurchasedSubscription;
    isLoading: boolean;
    userId: string;
}

export const PlanButton = ({
    stripePriceId,
    stripePurchaseLink,
    freeTrialStatus,
    subscriptionStatus,
    subscriptionInfo,
    isLoading,
    userId,
}: PlanButton) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const welcomeEmail = searchParams.get("welcomeEmail");

    const startFreeTrial = async () => {
        const freeTrialEndDate = increaseDate({
            date: new Date(),
            days: welcomeEmail === "true" ? 14 : 7,
        });

        try {
            await createFreeTrialTable({
                userId,
                stripePriceId: stripePriceId,
                freeTrialEndDate,
            });

            toast.success("Free Trial has been started");
            router.push("/");
        } catch (error) {
            toast.error("Error starting free trial");
        }
    };

    const determinePaidSubscriptionButtonProps = () => {
        const hasPurchasedSubscription = subscriptionStatus === SubscriptionStatus.ACTIVE;
        const isOnFreeTrial = freeTrialStatus === FreeTrialStatus.ACTIVE;

        if (hasPurchasedSubscription && !isOnFreeTrial) {
            const isCurrentPlan = subscriptionInfo?.stripe_price_id === stripePriceId;

            return isCurrentPlan
                ? { title: "Current Plan", disabled: true }
                : {
                      title: "Get Started Now",
                      onClick: () => window.open(stripePurchaseLink),
                      disabled: false,
                  };
        }

        return null;
    };

    const determineButtonProps = () => {
        if (freeTrialStatus === null) {
            return {
                onClick: startFreeTrial,
                title: `Start Free Trial (${welcomeEmail === "true" ? "14" : "7"} Days)`,
                disabled: isLoading,
                isLoading: isLoading,
            };
        }

        const subscriptionProps = determinePaidSubscriptionButtonProps();

        if (subscriptionProps) {
            return subscriptionProps;
        }

        return {
            title: "Upgrade Now",
            onClick: () => window.open(stripePurchaseLink),
            disabled: isLoading,
            isLoading: isLoading,
        };
    };

    return <CustomButton {...determineButtonProps()} />;
};
