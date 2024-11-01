import { TextConstants } from "@/constants/TextConstants";
import { FreeTrialStatus } from "@/enums/FreeTrialStatus";
import { FreeTrial } from "@/interfaces/FreeTrial";
import { formatDateToHumanFormat } from "@/lib/helper/formatDateToHumanFormat";

interface PlanHeaderParams {
    name: string;
    isHighlighted: boolean;
    freeTrialData: FreeTrial | null;
    freeTrialStatus: FreeTrialStatus | null;
    stripePriceId: string;
}

export const PlanHeader = ({
    name,
    isHighlighted,
    freeTrialData,
    freeTrialStatus,
    stripePriceId,
}: PlanHeaderParams) => {
    const indicatorText = () => {
        const isCurrentPlan = freeTrialData?.stripe_price_id === stripePriceId;
        const isOnFreeTrial = freeTrialStatus === FreeTrialStatus.ACTIVE;

        if (isOnFreeTrial && isCurrentPlan && freeTrialData?.end_date) {
            return (
                <div className="mb-4 whitespace-nowrap rounded-md bg-black px-2.5 py-0.5 text-center text-sm text-white">
                    {TextConstants.TEXT__FREE_TRIAL_END_DATE}:{" "}
                    {formatDateToHumanFormat(freeTrialData.end_date)}
                </div>
            );
        }

        if (isHighlighted) {
            return (
                <div className="mb-4 whitespace-nowrap rounded-md bg-black px-2.5 py-0.5 text-center text-sm text-white">
                    {TextConstants.TEXT__MOST_POPULAR_OPTION}
                </div>
            );
        }

        return null;
    };

    return (
        <div className="mb-6">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 transform">
                {indicatorText()}
            </div>

            <h2 className="mb-6 text-lg font-medium">{name}</h2>
        </div>
    );
};
