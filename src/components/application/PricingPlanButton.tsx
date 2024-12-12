import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { DefaultPricingPlan } from "@/data/marketing/pricing-data";
import { initiateStripeCheckoutProcess } from "@/services/stripe/stripeService";
import { useState } from "react";
import { toast } from "sonner";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const _getButtonText = ({
    currentPlanStripePriceId,
    plan,
    isUserLoggedIn,
}: {
    currentPlanStripePriceId: string;
    plan: DefaultPricingPlan;
    isUserLoggedIn: boolean;
}) => {
    if (!isUserLoggedIn && plan.stripe_price_id === "price_free") {
        return "Sign Up - It's Free";
    }

    if (!isUserLoggedIn) {
        return "Unlock Plan";
    }

    const isCurrentPlan = plan.stripe_price_id === currentPlanStripePriceId;

    if (isCurrentPlan && currentPlanStripePriceId) {
        return "Current Plan";
    }

    if (currentPlanStripePriceId) {
        return "Switch to Plan";
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
        const { checkoutUrl, error } = await initiateStripeCheckoutProcess({
            stripePriceId: plan.stripe_price_id,
            successUrl: `${window.location.origin}/choose-pricing-plan`,
            cancelUrl: `${window.location.origin}/choose-pricing-plan`,
        });

        if (error) throw error;

        router.push(checkoutUrl ?? "/choose-pricing-plan");
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

            await _handleStripeCheckout(plan, router);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            onClick={handleClick}
            variant={_getButtonColors(currentPlanStripePriceId, plan)}
            disabled={currentPlanStripePriceId === plan.stripe_price_id}
            isLoading={isLoading}
            className="w-full"
        >
            {_getButtonText({ currentPlanStripePriceId, plan, isUserLoggedIn })}
        </Button>
    );
};

export default PricingPlanButton;
