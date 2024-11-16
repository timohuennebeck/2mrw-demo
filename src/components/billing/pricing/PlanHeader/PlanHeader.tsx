import { TextConstants } from "@/constants/TextConstants";
import { PlanHeaderParams } from "./PlanHeader.interface";

export const PlanHeader = ({ name, isHighlighted }: PlanHeaderParams) => {
    const indicatorText = () => {
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
