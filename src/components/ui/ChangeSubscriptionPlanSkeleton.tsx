const ChangeSubscriptionPlanSkeleton = () => {
    return (
        <div>
            <div className="mb-6">
                <div className="mb-2 h-7 w-1/4 animate-pulse rounded bg-gray-200" />
                <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200" />
            </div>

            {/* Billing cycle buttons skeleton */}
            <div className="mb-6 flex space-x-4">
                <div className="h-9 w-24 animate-pulse rounded bg-gray-200" />
                <div className="h-9 w-32 animate-pulse rounded bg-gray-200" />
                <div className="h-9 w-32 animate-pulse rounded bg-gray-200" />
            </div>

            <div className="space-y-4">
                {/* Plan options skeleton - showing 3 plans */}
                {[...Array(2)].map((_, index) => (
                    <div key={index} className="relative rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div className="mr-6 flex w-full items-center">
                                <div className="mr-3 h-5 w-5 animate-pulse rounded-full bg-gray-200" />
                                <div className="w-full">
                                    <div className="mb-1 h-6 w-48 animate-pulse rounded bg-gray-200" />
                                    <div className="h-8 w-full animate-pulse rounded bg-gray-200" />
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="mb-1 h-6 w-24 animate-pulse rounded bg-gray-200" />
                                <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Action button skeleton */}
            <div className="mt-6">
                <div className="h-10 w-32 animate-pulse rounded bg-gray-200" />
            </div>
        </div>
    );
};

export default ChangeSubscriptionPlanSkeleton;
