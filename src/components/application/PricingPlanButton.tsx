import { billingConfig, isOneTimePaymentEnabled, ROUTES_CONFIG } from "@/config";
import { DefaultPricingPlan } from "@/config";
import { TextConstants } from "@/constants/TextConstants";
import { useFreeTrial } from "@/context/FreeTrialContext";
import { useSubscription } from "@/context/SubscriptionContext";
import { useUser } from "@/context/UserContext";
import { EmailType } from "@/enums";
import { startFreeTrial } from "@/services/database/freeTrialService";
import { sendLoopsTransactionalEmail } from "@/services/loops/loopsService";
import { createStripeBillingPortal, createStripeCheckout } from "@/services/stripe/stripeService";
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
    if (!isUserLoggedIn) {
        if (plan.stripe_price_id === "price_free") return "Sign Up - It's Free";

        return "Unlock Plan";
    }

    if (plan.stripe_price_id === currentPlanStripePriceId) {
        return "Current Plan";
    }

    if (!currentPlanStripePriceId && plan.stripe_price_id === "price_free") {
        return "Unlock Plan - It's Free";
    }

    if (canStartFreeTrial && !isOnFreeTrial && plan.stripe_price_id !== "price_free") {
        return TextConstants.TEXT__START_FREE_TRIAL(billingConfig.freeTrial.duration);
    }

    if (!currentPlanStripePriceId || currentPlanStripePriceId === "price_free") {
        return "Unlock Plan";
    }

    return "Change Plan";
};

const _getButtonColors = (currentPlanStripePriceId: string, plan: DefaultPricingPlan) => {
    if (plan.stripe_price_id === currentPlanStripePriceId) {
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

            if (canStartFreeTrial && !isOnFreeTrial && !isOneTimePaymentEnabled()) {
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
                return;
            }

            if (!currentPlanStripePriceId || plan.stripe_price_id === "price_free") {
                await _handleStripeCheckout(plan, router);
                return;
            }

            const result = await createStripeBillingPortal(dbUser?.stripe_customer_id ?? "");
            if (result.error) throw result.error;

            if (result.portalUrl) {
                window.open(result.portalUrl, "_blank");
            }
        } catch (error) {
            toast.error("There has been an error creating the checkout session");
            throw error;
        } finally {
            setIsLoading(false);
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
