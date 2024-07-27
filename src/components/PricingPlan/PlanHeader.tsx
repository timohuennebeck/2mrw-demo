import { FreeTrialStatus } from "@/enums/FreeTrialStatus";
import { FreeTrial } from "@/interfaces/FreeTrial";
import { formatDateToHumanFormat } from "@/lib/helper/formatDateToHumanFormat";

interface PlanHeaderParams {
    name: string;
    isHighlighted: boolean;
    freeTrialInfo: FreeTrial | null;
    freeTrialStatus: FreeTrialStatus | null;
    stripePriceId: string;
}

export const PlanHeader = ({
    name,
    isHighlighted,
    freeTrialInfo,
    freeTrialStatus,
    stripePriceId,
}: PlanHeaderParams) => {
    const indicatorText = () => {
        const isCurrentPlan = freeTrialInfo?.stripe_price_id === stripePriceId;
        const isOnFreeTrial = freeTrialStatus === FreeTrialStatus.ACTIVE;

        if (isOnFreeTrial && isCurrentPlan && freeTrialInfo?.end_date) {
            return (
                <div className="bg-black text-white text-sm px-2.5 py-0.5 rounded-md mb-4 text-center whitespace-nowrap">
                    Free Trial End Date: {formatDateToHumanFormat(freeTrialInfo.end_date)}
                </div>
            );
        }

        if (isHighlighted) {
            return (
                <div className="bg-black text-white text-sm px-2.5 py-0.5 rounded-md mb-4 text-center whitespace-nowrap">
                    Most Popular Option
                </div>
            );
        }

        return null;
    };

    return (
        <div className="mb-6">
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                {indicatorText()}
            </div>

            <h2 className="text-lg mb-6 font-medium">{name}</h2>
        </div>
    );
};
