import { CheckBadgeIcon, XMarkIcon } from "@heroicons/react/24/solid";
import FormButton from "./FormButton";

interface Feature {
    name: string;
    included: boolean;
}

interface PricingPlanCard {
    name: string;
    price: number;
    previousPrice: number;
    description: string;
    discountInfo: string;
    features: Feature[];
    isHighlighted: boolean;
    onClick: () => void;
}

export const PricingPlanCard = ({
    name,
    price,
    previousPrice,
    description,
    discountInfo,
    features,
    isHighlighted,
    onClick,
}: PricingPlanCard) => (
    <div
        className={`bg-white rounded-2xl shadow-lg border p-8 ${
            isHighlighted ? "border-black" : ""
        }`}
    >
        <div className="mb-6">
            <h3 className="text-lg mb-6 font-medium">{name}</h3>

            <p className="text-gray-600 line-through font-medium">${previousPrice}</p>

            <div className="mb-6">
                <span className="text-3xl font-medium">${price}</span>
                <span className="text-gray-600 ml-2">USD</span>
            </div>

            <p className="text-gray-600 text-sm mb-2">{description}</p>

            <p className="text-gray-600 text-sm mb-8">{discountInfo}</p>

            <ul className="flex flex-col gap-3 mb-10">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                        {feature.included ? (
                            <CheckBadgeIcon className="w-5 h-5 text-black" />
                        ) : (
                            <XMarkIcon className="w-5 h-5 text-gray-400" />
                        )}
                        <span
                            className={`text-sm ${
                                feature.included ? "text-gray-600" : "text-gray-400"
                            }`}
                        >
                            {feature.name}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
        <FormButton title="Get Started Now (20% off)" onClick={onClick} disabled={false} />
        <p className="text-center text-sm text-gray-600 mt-4">Purchase Once. Forever Yours.</p>
    </div>
);
