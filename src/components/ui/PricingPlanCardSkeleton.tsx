export const PricingPlanCardSkeleton = () => {
    return (
        <div className="relative rounded-2xl border bg-white p-8 shadow-lg">
            <div className="mb-6">
                <div className="skeleton-header mb-4">
                    {/* Placeholder for PlanHeader */}
                    <div className="mb-2 h-6 w-1/2 rounded bg-gray-200"></div>
                    <div className="h-4 w-1/3 rounded bg-gray-200"></div>
                </div>

                <div className="skeleton-pricing mb-4">
                    {/* Placeholder for PlanPricing */}
                    <div className="mb-2 h-8 w-1/4 rounded bg-gray-200"></div>
                    <div className="h-4 w-1/5 rounded bg-gray-200"></div>
                </div>

                <div className="skeleton-description mb-4">
                    {/* Placeholder for description */}
                    <div className="mb-2 h-4 w-full rounded bg-gray-200"></div>
                    <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                </div>

                <div className="skeleton-features mb-4">
                    {/* Placeholder for PlanFeatures */}
                    {[...Array(5)].map((_, index) => (
                        <div key={index} className="mb-2 flex items-center">
                            <div className="mr-2 h-[31.25px] w-[31.25px] rounded-full bg-gray-200"></div>
                            <div className="h-[31.25px] w-3/4 rounded bg-gray-200"></div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="skeleton-button mb-4">
                {/* Placeholder for PlanButton */}
                <div className="h-10 w-full rounded bg-gray-200"></div>
            </div>

            <div className="skeleton-footer">
                {/* Placeholder for footer text */}
                <div className="mx-auto h-4 w-2/3 rounded bg-gray-200"></div>
            </div>
        </div>
    );
};
