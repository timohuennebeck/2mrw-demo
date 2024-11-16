import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import { PlanFeatures } from "../../pricing/PlanFeatures/PlanFeatures";
import { getProductDetailsByStripePriceId } from "@/services/domain/pricingService";
import { getCurrency } from "@/config/paymentConfig";
import { CalendarClock } from "lucide-react";
import { getFeaturesWithAvailability } from "@/services/domain/featureService";
import { formatDateToDayMonthYear } from "@/utils/date/dateHelper";
import { useSubscription } from "@/context/SubscriptionContext";
import { ProductWithPrices } from "@/interfaces";
import FormHeader from "../../../forms/FormHeader/FormHeader";
import { BillingPlan, SubscriptionInterval, SubscriptionStatus } from "@/enums";
import { CurrentSubscriptionPlanParams } from "./CurrentSubscriptionPlan.interface";

const _getProductPricing = (isFreeProduct: boolean, currentPrice: number) => {
    if (isFreeProduct) {
        return "Free";
    }

    if (currentPrice) {
        return `${getCurrency() === "EUR" ? "€" : "$"} ${currentPrice}`;
    }

    return "N/A";
};

const CurrentSubscriptionPlan = ({ products }: CurrentSubscriptionPlanParams) => {
    const { subscription } = useSubscription();

    const activeStripePriceId = subscription?.stripe_price_id ?? null;

    const productDetails = getProductDetailsByStripePriceId(products, activeStripePriceId);

    const features = productDetails
        ? getFeaturesWithAvailability(productDetails.subscription_tier)
        : [];

    const isFreeProduct = productDetails?.billing_plan === BillingPlan.NONE;
    const isOneTimePaymentProduct = productDetails?.billing_plan === BillingPlan.ONE_TIME;

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
        if (subscription?.billing_plan === BillingPlan.NONE) {
            return "You are on the free plan which is free forever!";
        }

        if (subscription?.billing_plan === BillingPlan.ONE_TIME) {
            return "You have lifetime access to this product!";
        }

        if (subscription?.billing_plan === BillingPlan.RECURRING) {
            const formattedEndDate = formatDateToDayMonthYear(subscription?.end_date);

            if (subscription?.status === SubscriptionStatus.ACTIVE) {
                return `Your subscription renews on ${formattedEndDate}!`;
            }

            if (subscription?.status === SubscriptionStatus.CANCELLED) {
                return `Your subscription will be downgraded to the free plan on ${formattedEndDate}!`;
            }
        }
    };

    return (
        <div>
            <FormHeader
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
                            {_getProductPricing(
                                isFreeProduct,
                                productDetails?.price?.current_amount ?? 0,
                            )}
                        </div>
                        <div className="whitespace-nowrap text-sm font-medium text-gray-500">
                            {isOneTimePaymentProduct
                                ? "ONE-TIME PAYMENT"
                                : isFreeProduct
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
