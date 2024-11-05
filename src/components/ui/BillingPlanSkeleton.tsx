const BillingPlanSkeleton = ({ isYearly }: { isYearly?: boolean }) => {
    return (
        <div
            className={`h-7 animate-pulse rounded border bg-neutral-100 ${
                isYearly ? "w-28" : "w-20"
            }`}
        />
    );
};

export default BillingPlanSkeleton;
