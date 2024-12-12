import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BillingPeriod } from "@/enums";
import { PurchasedSubscription } from "@/interfaces";
import { getPricingPlan } from "@/services/domain/subscriptionService";
import { stripe } from "@/services/stripe/client";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export const _createStripeBillingPortal = async (stripeCustomerId: string) => {
    try {
        const { url } = await stripe.billingPortal.sessions.create({
            customer: stripeCustomerId,
            return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/billing`,
        });

        return { portalUrl: url, error: null };
    } catch (error) {
        return { portalUrl: null, error };
    }
};

const CurrentSubscriptionPlan = ({
    subscription,
    stripeCustomerId,
    currentPlanStripePriceId,
}: {
    subscription: PurchasedSubscription;
    stripeCustomerId: string;
    currentPlanStripePriceId: string;
}) => {
    const [isOpeningBillingPortal, setIsOpeningBillingPortal] = useState(false);

    const router = useRouter();

    const { pricingPlan } = getPricingPlan(currentPlanStripePriceId);

    const handleBillingPortal = async () => {
        setIsOpeningBillingPortal(true);
        try {
            const { portalUrl, error } = await _createStripeBillingPortal(stripeCustomerId);
            if (error) throw error;

            if (portalUrl) {
                router.push(portalUrl);
            }
        } catch (error) {
            toast.error("There has been an error opening the billing portal");
        } finally {
            setIsOpeningBillingPortal(false);
        }
    };

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
                                    : `/${pricingPlan?.billing_period.slice(0, 5)}`}
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {subscription?.end_date
                                ? moment(subscription?.end_date).format("DD/MM/YYYY")
                                : "Free Forever"}
                        </p>
                    </div>

                    {subscription.stripe_price_id !== "price_free" && (
                        <Button
                            variant="secondary"
                            size="sm"
                            className="w-full transition-colors hover:bg-secondary/80 md:w-auto"
                            disabled={isOpeningBillingPortal}
                            isLoading={isOpeningBillingPortal}
                            onClick={handleBillingPortal}
                        >
                            Change Subscription
                        </Button>
                    )}

                    {/* Payment Info */}
                    <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex h-6 items-center justify-center rounded border bg-white px-2">
                                <span className="text-xs">MASTERCARD</span>
                            </div>
                            <span className="text-sm text-muted-foreground">ending in **52</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default CurrentSubscriptionPlan;
