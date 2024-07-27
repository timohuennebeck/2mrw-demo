interface PlanPricingProps {
    previousPrice: number;
    currentPrice: number;
}

export const PlanPricing = ({ previousPrice, currentPrice }: PlanPricingProps) => (
    <div className="mb-6">
        <p className="text-gray-600 line-through font-medium">${previousPrice}</p>
        <div className="mb-6">
            <span className="text-3xl font-medium">${currentPrice}</span>
            <span className="text-gray-600 ml-2">USD</span>
        </div>
    </div>
);
