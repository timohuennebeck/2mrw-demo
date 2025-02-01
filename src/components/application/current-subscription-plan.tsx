import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BillingPeriod, FreeTrialStatus, SubscriptionStatus } from "@/enums";
import { PurchasedSubscription } from "@/interfaces";
import { FreeTrial } from "@/interfaces/models/freeTrial";
import { getPricingPlan } from "@/services/domain/pricingService";
import {
    createStripeBillingPortal,
    createStripeCheckout,
    getStripeCreditCardDetails,
} from "@/services/stripe/stripeService";
import { Loader } from "lucide-react";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const _getExpirationDateText = (subscription: PurchasedSubscription, freeTrial: FreeTrial) => {
    const isFreePlan = subscription?.stripe_price_id === "price_free";
    const isOnFreeTrial = subscription?.status === SubscriptionStatus.TRIALING;
    const isSubscriptionCancelled = subscription?.status === SubscriptionStatus.CANCELLED;

    const isRecurringPayment = subscription?.billing_period === BillingPeriod.MONTHLY;
    const subscriptionRenews = !isSubscriptionCancelled && isRecurringPayment;

    const isOneTimePayment = subscription?.billing_period === BillingPeriod.LIFETIME;

    if (isFreePlan) {
        return "Free Forever";
    }

    if (isOnFreeTrial) {
        return `Free Trial Expires on ${moment(freeTrial?.end_date).format("DD-MM-YYYY")}`;
    }

    if (isSubscriptionCancelled) {
        return `Expires on ${moment(subscription?.end_date).format("DD-MM-YYYY")}`;
    }

    if (subscriptionRenews) {
        return `Renews on ${moment(subscription?.end_date).format("DD-MM-YYYY")}`;
    }

    if (isOneTimePayment) {
        return "This is a OTP. It will never renew.";
    }

    return "N/A";
};

const _getButtonText = (subscription: PurchasedSubscription) => {
    const isOnFreeTrial = subscription?.status === SubscriptionStatus.TRIALING;
    const isFreePlan = subscription?.stripe_price_id === "price_free";
    const isOneTimePayment = subscription?.billing_period === BillingPeriod.LIFETIME;

    if (isFreePlan) {
        return "Choose a Plan";
    }

    if (isOnFreeTrial) {
        return "Upgrade to Paid Plan";
    }

    if (isOneTimePayment) {
        return "Manage Billing Details";
    }

    return "Change Subscription";
};

const CurrentSubscriptionPlan = ({
    subscription,
    freeTrial,
    stripeCustomerId,
    currentPlanStripePriceId,
}: {
    subscription: PurchasedSubscription;
    freeTrial: FreeTrial;
    stripeCustomerId: string;
    currentPlanStripePriceId: string;
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [lastFourDigits, setLastFourDigits] = useState("");
    const [cardBrand, setCardBrand] = useState("");

    const router = useRouter();

    const pricingPlan = getPricingPlan(currentPlanStripePriceId);

    useEffect(() => {
        if (!stripeCustomerId) return;

        const fetchPaymentMethod = async () => {
            try {
                const response = await getStripeCreditCardDetails(stripeCustomerId);
                if (response.error) return;

                setLastFourDigits(response.lastFourDigits ?? "");
                setCardBrand(response.brand ?? "");
            } catch (error) {
                throw error;
            }
        };

        fetchPaymentMethod();
    }, [stripeCustomerId]);

    const handleBillingPortal = async () => {
        setIsLoading(true);

        try {
            const { portalUrl, error } = await createStripeBillingPortal(stripeCustomerId);
            if (error) throw error;

            if (portalUrl) {
                window.open(portalUrl, "_blank");
            }
        } catch (error) {
            toast.error("There has been an error opening the billing portal");
        } finally {
            setIsLoading(false);
        }
    };

    const handleStripeCheckout = async (stripePriceId: string) => {
        setIsLoading(true);

        try {
            const { checkoutUrl, error } = await createStripeCheckout({
                stripePriceId: stripePriceId,
                successUrl: `${window.location.origin}/plan-confirmation?mode=subscription`,
                cancelUrl: `${window.location.origin}/choose-pricing-plan`,
            });

            if (error) throw error;

            window.open(checkoutUrl ?? "/choose-pricing-plan", "_blank");
        } catch (error) {
            toast.error("There has been an error creating the checkout session");
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    if (!subscription || !stripeCustomerId || !currentPlanStripePriceId) {
        return (
            <div className="flex h-[224px] w-full items-center justify-center">
                <Loader className="h-4 w-4 animate-spin" />
            </div>
        );
    }

    return (
        <Card className="w-full border-none bg-transparent shadow-none">
            <CardContent className="p-0">
                <div className="flex flex-col space-y-6 md:space-y-8">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:justify-between md:gap-20">
                        <div className="space-y-2 md:space-y-3">
                            <div className="flex flex-col gap-2 md:flex-row md:items-center">
                                <h3 className="text-xl font-medium md:text-2xl">
                                    {pricingPlan?.name}
                                </h3>
                                <Badge variant="default" className="flex w-fit items-center gap-1">
                                    {subscription?.status}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground/80">
                                {pricingPlan?.description}
                            </p>
                        </div>
                    </div>

                    {/* Billing Info */}
                    <div className="space-y-2">
                        <div className="flex items-baseline gap-1">
                            <p className="text-2xl font-medium tracking-tight md:text-3xl">
                                {pricingPlan?.price}
                            </p>
                            <span className="text-sm text-muted-foreground">
                                {pricingPlan?.billing_period === BillingPeriod.LIFETIME
                                    ? ""
                                    : pricingPlan?.billing_period === BillingPeriod.MONTHLY
                                      ? `/ MONTH`
                                      : `/ YEAR`}
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {_getExpirationDateText(subscription, freeTrial)}
                        </p>
                    </div>

                    <Button
                        variant="secondary"
                        size="sm"
                        className="w-full transition-colors hover:bg-secondary/80 md:w-auto"
                        disabled={isLoading}
                        isLoading={isLoading}
                        onClick={() => {
                            const isOnFreeTrial = freeTrial?.status === FreeTrialStatus.ACTIVE;
                            if (subscription?.stripe_price_id === "price_free") {
                                router.push("/choose-pricing-plan");
                                return;
                            }

                            if (isOnFreeTrial) {
                                handleStripeCheckout(subscription?.stripe_price_id);
                            } else {
                                handleBillingPortal();
                            }
                        }}
                    >
                        {_getButtonText(subscription)}
                    </Button>

                    {/* Payment Info */}
                    {lastFourDigits && cardBrand && (
                        <div className="flex justify-between">
                            <div className="flex items-center gap-2">
                                <div className="flex h-6 items-center justify-center rounded border bg-white px-2">
                                    <span className="text-xs">{cardBrand?.toUpperCase()}</span>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                    ending in {lastFourDigits}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default CurrentSubscriptionPlan;
