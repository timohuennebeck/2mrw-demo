export const PricingPlanCardSkeleton = () => {
    return (
        <div className="bg-white rounded-2xl shadow-lg border p-8 relative">
            <div className="mb-6">
                <div className="skeleton-header mb-4">
                    {/* Placeholder for PlanHeader */}
                    <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>

                <div className="skeleton-pricing mb-4">
                    {/* Placeholder for PlanPricing */}
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/5"></div>
                </div>

                <div className="skeleton-description mb-4">
                    {/* Placeholder for description */}
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>

                <div className="skeleton-features mb-4">
                    {/* Placeholder for PlanFeatures */}
                    {[...Array(5)].map((_, index) => (
                        <div key={index} className="flex items-center mb-2">
                            <div className="h-[31.25px] w-[31.25px] bg-gray-200 rounded-full mr-2"></div>
                            <div className="h-[31.25px] bg-gray-200 rounded w-3/4"></div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="skeleton-button mb-4">
                {/* Placeholder for PlanButton */}
                <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>

            <div className="skeleton-footer">
                {/* Placeholder for footer text */}
                <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
            </div>
        </div>
    );
};
