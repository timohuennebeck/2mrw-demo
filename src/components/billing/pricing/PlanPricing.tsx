import { getCurrency, isOneTimePaymentEnabled } from "@/config/paymentConfig";
import { getPriceForCurrentProduct } from "@/services/domain/pricingService";
import { StripePrice, SubscriptionInterval } from "@/interfaces";

interface PlanPricingProps {
    prices: StripePrice[];
    billingCycle: SubscriptionInterval;
}

export const PlanPricing = ({ prices, billingCycle }: PlanPricingProps) => {
    const { current_amount, previous_amount } = getPriceForCurrentProduct(prices, billingCycle);

    return (
        <div className="mb-6">
            {previous_amount !== 0 && (
                <p className="font-medium text-neutral-600 line-through">
                    {previous_amount} {getCurrency()}
                </p>
            )}
            <div className="mb-6">
                <span className="text-3xl font-medium">
                    {getCurrency() === "EUR" ? "€" : "$"}
                    {current_amount}
                </span>

                {!isOneTimePaymentEnabled() && (
                    <span className="ml-2 text-neutral-600">
                        {`/ ${billingCycle === SubscriptionInterval.YEARLY ? "PER YEAR" : "PER MONTH"}`}
                    </span>
                )}
            </div>
        </div>
    );
};
