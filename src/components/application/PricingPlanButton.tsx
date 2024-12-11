import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { DefaultPricingPlan } from "@/data/marketing/pricing-data";
import { initiateStripeCheckoutProcess } from "@/services/stripe/stripeService";

const _getButtonText = (activePlanStripePriceId: string, plan: DefaultPricingPlan) => {
    if (activePlanStripePriceId === plan.stripe_price_id) {
        return "Current Plan";
    }

    return "Unlock Plan";
};

const _getButtonColors = (activePlanStripePriceId: string, plan: DefaultPricingPlan) => {
    if (activePlanStripePriceId === plan.stripe_price_id) {
        return "default";
    }

    if (plan.is_highlighted) {
        return "default";
    }

    return "outline";
};

interface PricingPlanButtonProps {
    plan: DefaultPricingPlan;
    activePlanStripePriceId: string;
    isUserLoggedIn: boolean;
}

const PricingPlanButton = ({
    plan,
    activePlanStripePriceId,
    isUserLoggedIn,
}: PricingPlanButtonProps) => {
    const router = useRouter();

    const handleClick = async () => {
        if (plan.stripe_price_id === "price_free") {
            router.push("/");
            return;
        }

        if (!isUserLoggedIn) {
            router.push("/auth/sign-up");
            return;
        }

        if (activePlanStripePriceId === plan.stripe_price_id) {
            return;
        }

        const { checkoutUrl, error } = await initiateStripeCheckoutProcess({
            stripePriceId: plan.stripe_price_id,
            successUrl: `${window.location.origin}/choose-pricing-plan`,
            cancelUrl: `${window.location.origin}/choose-pricing-plan`,
        });

        if (error) return;

        router.push(checkoutUrl ?? "/choose-pricing-plan");
    };

    return (
        <Button
            onClick={handleClick}
            variant={_getButtonColors(activePlanStripePriceId, plan)}
            disabled={activePlanStripePriceId === plan.stripe_price_id}
            className="w-full"
        >
            {_getButtonText(activePlanStripePriceId, plan)}
        </Button>
    );
};

export default PricingPlanButton;
