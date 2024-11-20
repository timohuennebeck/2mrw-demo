const CurrentSubscriptionPlanSkeleton = () => {
    return (
        <div>
            <div className="mb-6">
                <div className="mb-2 h-7 w-1/4 animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
            </div>

            <div className="rounded-lg border border-gray-200 p-4">
                <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="h-5 w-5 animate-pulse rounded-full bg-gray-200" />
                            <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
                        </div>
                        <div className="ml-3 h-5 w-16 animate-pulse rounded bg-gray-200" />
                    </div>

                    <div className="text-right">
                        <div className="h-6 w-24 animate-pulse rounded bg-gray-200" />
                        <div className="mt-1 h-4 w-16 animate-pulse rounded bg-gray-200" />
                    </div>
                </div>

                <div className="mb-4 mt-2 h-4 w-3/4 animate-pulse rounded bg-gray-200" />

                <div className="border-t border-gray-200 pb-4" />

                <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
                </div>

                <div className="mt-4">
                    {/* Feature list skeleton */}
                    {[...Array(5)].map((_, index) => (
                        <div key={index} className="mb-3 flex items-center gap-2">
                            <div className="h-5 w-5 animate-pulse rounded-full bg-gray-200" />
                            <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CurrentSubscriptionPlanSkeleton;
