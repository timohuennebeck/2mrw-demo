import { getCurrency, isOneTimePaymentEnabled } from "@/config/paymentConfig";
import { PricingModel, StripePrice, SubscriptionInterval } from "@/interfaces/StripePrices";

interface PlanPricingProps {
    prices: StripePrice[];
    billingCycle: SubscriptionInterval;
}

export const PlanPricing = ({ prices, billingCycle }: PlanPricingProps) => {
    const getPriceInfo = () => {
        if (isOneTimePaymentEnabled()) {
            const oneTimePrice = prices.find((p) => p.pricing_model === PricingModel.ONE_TIME);

            return {
                current: oneTimePrice?.current_amount ?? 0,
                previous: oneTimePrice?.previous_amount ?? 0,
            };
        }

        if (billingCycle === SubscriptionInterval.YEARLY) {
            const yearlyPrice = prices.find(
                (p) => p.subscription_interval === SubscriptionInterval.YEARLY,
            );

            return {
                current: yearlyPrice?.current_amount ?? 0,
                previous: yearlyPrice?.previous_amount ?? 0,
            };
        } else {
            const monthlyPrice = prices.find(
                (p) => p.subscription_interval === SubscriptionInterval.MONTHLY,
            );

            return {
                current: monthlyPrice?.current_amount ?? 0,
                previous: monthlyPrice?.previous_amount ?? 0,
            };
        }
    };

    const priceInfo = getPriceInfo();

    return (
        <div className="mb-6">
            {priceInfo.previous !== 0 && (
                <p className="font-medium text-neutral-600 line-through">
                    {priceInfo.previous} {getCurrency()}
                </p>
            )}
            <div className="mb-6">
                <span className="text-3xl font-medium">
                    {getCurrency() === "EUR" ? "€" : "$"}
                    {priceInfo.current}
                </span>
                <span className="ml-2 text-neutral-600">
                    {!isOneTimePaymentEnabled() &&
                        `/${
                            billingCycle === SubscriptionInterval.YEARLY
                                ? "per 12 months"
                                : "per month"
                        }`}
                </span>
            </div>
        </div>
    );
};
