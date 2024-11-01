import { isOneTimePaymentEnabled } from "@/config/paymentConfig";
import { ProductPricing } from "@/interfaces/ProductInterfaces";

interface PlanPricingProps {
    pricing: ProductPricing;
    billingCycle: "monthly" | "yearly";
}

export const PlanPricing = ({ pricing, billingCycle }: PlanPricingProps) => {
    const getPriceInfo = () => {
        if (isOneTimePaymentEnabled()) {
            return {
                current: pricing?.one_time?.current ?? 0,
                previous: pricing?.one_time?.previous ?? 0,
            };
        }

        if (billingCycle === "yearly") {
            return {
                current: pricing?.subscription?.yearly?.current ?? 0,
                previous: pricing?.subscription?.yearly?.previous ?? 0,
            };
        }

        return {
            current: pricing?.subscription?.monthly?.current ?? 0,
            previous: pricing?.subscription?.monthly?.previous ?? 0,
        };
    };

    const priceInfo = getPriceInfo();

    return (
        <div className="mb-6">
            {priceInfo.previous !== 0 && (
                <p className="font-medium text-neutral-600 line-through">${priceInfo.previous}</p>
            )}
            <div className="mb-6">
                <span className="text-3xl font-medium">${priceInfo.current}</span>
                <span className="ml-2 text-neutral-600">
                    {!isOneTimePaymentEnabled() &&
                        `/${billingCycle === "yearly" ? "year" : "month"}`}
                </span>
            </div>
        </div>
    );
};
