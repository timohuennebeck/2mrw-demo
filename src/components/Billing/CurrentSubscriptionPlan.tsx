import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import HeaderWithDescription from "../HeaderWithDescription";
import { useSession } from "@/context/SessionContext";
import useSubscription from "@/hooks/useSubscription";
import { SubscriptionStatus } from "@/enums/SubscriptionStatus";
import { useProducts } from "@/context/ProductsContext";
import { PlanFeatures } from "../PricingPlan/PlanFeatures";
import { getProductDetailsByStripePriceId } from "@/services/domain/PricingService";
import { getCurrency } from "@/config/paymentConfig";
import { BillingPlan, SubscriptionInterval } from "@/interfaces/StripePrices";
import { CalendarClock } from "lucide-react";
import { getFeaturesWithAvailability } from "@/services/domain/FeatureService";
import { formatDateToDayMonthYear } from "@/lib/helper/DateHelper";
import { SubscriptionTier } from "@/enums/SubscriptionTier";

const CurrentSubscriptionPlan = () => {
    const { authUser } = useSession();
    const { products } = useProducts();
    const { subscription } = useSubscription(authUser?.id ?? "");

    const activeStripePriceId = subscription?.stripe_price_id;

    if (!products) return null;

    const productDetails = getProductDetailsByStripePriceId(products, activeStripePriceId);

    const features = productDetails
        ? getFeaturesWithAvailability(productDetails.subscription_tier)
        : [];

    const isFreeProduct = productDetails?.billing_plan === BillingPlan.NONE;

    const renderStatusBadge = (text: string, variant: "green" | "yellow" | "red") => {
        const colors = {
            green: "bg-green-100 text-green-800",
            yellow: "bg-yellow-100 text-yellow-800",
            red: "bg-red-100 text-red-800",
        };

        return (
            <span className={`ml-3 rounded-md px-3 py-1 text-xs font-medium ${colors[variant]}`}>
                {text}
            </span>
        );
    };

    const renderSubscriptionStatus = () => {
        if (subscription?.status === SubscriptionStatus.ACTIVE) {
            return renderStatusBadge("ACTIVE", "green");
        }

        if (subscription?.status === SubscriptionStatus.CANCELLED) {
            return renderStatusBadge("CANCELLED", "red");
        }

        return null;
    };

    const getSubscriptionStatusMessage = () => {
        if (subscription?.subscription_tier === SubscriptionTier.FREE) {
            return "You are on the free plan which is free forever!";
        }

        if (subscription?.end_date === null) {
            return null;
        }

        switch (subscription?.status) {
            case SubscriptionStatus.ACTIVE:
                return `Your subscription renews on ${formatDateToDayMonthYear(subscription.end_date)}!`;
            case SubscriptionStatus.CANCELLED:
                return `Your subscription has been cancelled and will be downgraded to the free plan on ${formatDateToDayMonthYear(
                    subscription.end_date,
                )}!`;
            default:
                return null;
        }
    };

    return (
        <div>
            <HeaderWithDescription
                title="Your Plan"
                description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam et odit autem alias aut praesentium vel nisi repudiandae saepe consectetur!"
            />

            <div className="rounded-lg border border-gray-200 p-4">
                <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <CheckBadgeIcon className="h-5 w-5 text-black" aria-hidden="true" />
                            <h4 className="text-xl font-medium text-gray-700">
                                {productDetails?.name}
                            </h4>
                        </div>

                        {renderSubscriptionStatus()}
                    </div>

                    <div className="text-right">
                        <div className="whitespace-nowrap text-xl font-medium text-gray-700">
                            {isFreeProduct
                                ? "Free"
                                : productDetails?.price?.current_amount
                                  ? `${getCurrency() === "EUR" ? "€" : "$"} ${productDetails.price.current_amount}`
                                  : "N/A"}
                        </div>
                        <div className="whitespace-nowrap text-sm font-medium text-gray-500">
                            {isFreeProduct
                                ? "FOREVER"
                                : productDetails?.price?.interval === SubscriptionInterval.MONTHLY
                                  ? "PER MONTH"
                                  : "PER YEAR"}
                        </div>
                    </div>
                </div>
                <p className="mb-4 text-sm text-gray-500">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Et odit autem alias
                    aut.
                </p>

                <div className="border-t border-gray-200 pb-4" />

                <div className="flex items-center gap-2">
                    <CalendarClock size={16} strokeWidth={1.5} className="text-gray-500" />
                    <p className="text-xs text-gray-500">{getSubscriptionStatusMessage()}</p>
                </div>

                <div className="mt-4">
                    <PlanFeatures features={features ?? []} />
                </div>
            </div>
        </div>
    );
};

export default CurrentSubscriptionPlan;
