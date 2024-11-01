import { isOneTimePaymentEnabled } from "@/config/paymentConfig";
import { ProductPricing } from "@/interfaces/ProductInterfaces";

interface PlanPricingProps {
    pricing: ProductPricing;
}

export const PlanPricing = ({ pricing }: PlanPricingProps) => {
    console.log("→ [LOG] pricing", pricing);

    return (
        <div className="mb-6">
            <p className="font-medium text-neutral-600 line-through">
                {isOneTimePaymentEnabled()
                    ? (pricing?.one_time?.previous ?? 0)
                    : (pricing?.subscription?.monthly?.previous ?? 0)}
            </p>
            <div className="mb-6">
                <span className="text-3xl font-medium">
                    {isOneTimePaymentEnabled()
                        ? (pricing?.one_time?.current ?? 0)
                        : (pricing?.subscription?.monthly?.current ?? 0)}
                </span>
                <span className="ml-2 text-neutral-600">USD</span>
            </div>
        </div>
    );
};
