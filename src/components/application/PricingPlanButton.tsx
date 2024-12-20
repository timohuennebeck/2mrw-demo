import { billingConfig, ROUTES_CONFIG } from "@/config";
import { TextConstants } from "@/constants/TextConstants";
import { useFreeTrial } from "@/context/FreeTrialContext";
import { useSubscription } from "@/context/SubscriptionContext";
import { useUser } from "@/context/UserContext";
import { DefaultPricingPlan } from "@/data/marketing/pricing-data";
import { EmailType } from "@/enums";
import { startFreeTrial } from "@/services/database/freeTrialService";
import { startFreePlan } from "@/services/database/subscriptionService";
import { sendLoopsTransactionalEmail } from "@/services/loops/loopsService";
import { createStripeCheckout } from "@/services/stripe/stripeService";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

const _getButtonText = ({
    currentPlanStripePriceId,
    plan,
    isUserLoggedIn,
    isOnFreeTrial,
    canStartFreeTrial,
}: {
    currentPlanStripePriceId: string;
    plan: DefaultPricingPlan;
    isUserLoggedIn: boolean;
    isOnFreeTrial: boolean;
    canStartFreeTrial: boolean;
}) => {
    if (!isUserLoggedIn && plan.stripe_price_id === "price_free") {
        return "Sign Up - It's Free";
    }

    if (!isUserLoggedIn) {
        return "Unlock Plan";
    }

    const isCurrentPlan = plan.stripe_price_id === currentPlanStripePriceId;

    if (isCurrentPlan) {
        return "Current Plan";
    }

    // check if the user has an active subscription that is not the free plan
    if (currentPlanStripePriceId && plan.stripe_price_id === "price_free") {
        return "Downgrade to Free";
    }

    if (!currentPlanStripePriceId && plan.stripe_price_id === "price_free") {
        return "Unlock Plan - It's Free";
    }

    if (canStartFreeTrial && !isOnFreeTrial && plan.stripe_price_id !== "price_free") {
        return TextConstants.TEXT__START_FREE_TRIAL(billingConfig.freeTrial.duration);
    }

    return "Unlock Plan";
};

const _getButtonColors = (currentPlanStripePriceId: string, plan: DefaultPricingPlan) => {
    const isCurrentPlan = plan.stripe_price_id === currentPlanStripePriceId;

    if (isCurrentPlan) {
        return "default";
    }

    if (!currentPlanStripePriceId && plan.is_highlighted) {
        return "default";
    }

    return "outline";
};

const _handleStripeCheckout = async (plan: DefaultPricingPlan, router: AppRouterInstance) => {
    try {
        const { checkoutUrl, error } = await createStripeCheckout({
            stripePriceId: plan.stripe_price_id,
            successUrl: `${window.location.origin}/plan-confirmation?mode=subscription`,
            cancelUrl: `${window.location.origin}/choose-pricing-plan`,
        });

        if (error) throw error;

        window.open(checkoutUrl ?? "/choose-pricing-plan", "_blank");
    } catch (error) {
        toast.error("There has been an error creating the checkout session");
        throw error;
    }
};

interface PricingPlanButtonProps {
    plan: DefaultPricingPlan;
    currentPlanStripePriceId: string;
    isUserLoggedIn: boolean;
}

const PricingPlanButton = ({
    plan,
    currentPlanStripePriceId,
    isUserLoggedIn,
}: PricingPlanButtonProps) => {
    const { dbUser } = useUser();
    const { canStartFreeTrial, isOnFreeTrial, invalidateFreeTrial } = useFreeTrial();
    const { invalidateSubscription } = useSubscription();

    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        setIsLoading(true);

        try {
            if (!isUserLoggedIn) {
                router.push("/auth/sign-up");
                return;
            }

            if (currentPlanStripePriceId && plan.stripe_price_id === currentPlanStripePriceId) {
                return; // current plan - no action needed
            }

            if (plan.stripe_price_id === "price_free") {
                await startFreePlan(dbUser?.id ?? "");
                invalidateSubscription();
                setIsLoading(false);
                return;
            }

            if (canStartFreeTrial && !isOnFreeTrial) {
                const response = await startFreeTrial(dbUser?.id ?? "", plan.stripe_price_id);
                if (response?.error) throw response.error;

                sendLoopsTransactionalEmail({
                    type: EmailType.FREE_TRIAL_STARTED,
                    email: dbUser?.email ?? "",
                    variables: {
                        freeTrialEndDate: response.freeTrialEndDate ?? "",
                    },
                });

                await Promise.all([invalidateFreeTrial(), invalidateSubscription()]);

                router.push(`${ROUTES_CONFIG.PROTECTED.PLAN_CONFIRMATION}?mode=free-trial`);
                setIsLoading(false);
                return;
            }

            await _handleStripeCheckout(plan, router);
            setIsLoading(false);
        } catch (error) {
            toast.error("There has been an error creating the checkout session");
            throw error;
        }
    };

    return (
        <Button
            onClick={handleClick}
            variant={_getButtonColors(currentPlanStripePriceId ?? "", plan)}
            disabled={currentPlanStripePriceId === plan.stripe_price_id}
            isLoading={isLoading}
            className="w-full"
        >
            {_getButtonText({
                currentPlanStripePriceId,
                plan,
                isUserLoggedIn,
                isOnFreeTrial,
                canStartFreeTrial,
            })}
        </Button>
    );
};

export default PricingPlanButton;
