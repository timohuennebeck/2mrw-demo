import { Check } from "lucide-react";

interface Feature {
    title: string;
    description: string;
}

interface FeaturesListParams {
    eyebrow?: string;
    heading: string;
    description: string;
    features: Feature[];
}

const FeatureItem = ({ title, description }: Feature) => (
    <div className="flex gap-3">
        <div className="flex-shrink-0">
            <Check className="h-6 w-6 text-blue-600" />
        </div>
        <div className="flex flex-col gap-2">
            <h3 className="text-lg font-medium">{title}</h3>
            <p className="text-base text-gray-600">{description}</p>
        </div>
    </div>
);

const FeaturesList = ({ eyebrow, heading, description, features }: FeaturesListParams) => {
    return (
        <div className="grid grid-cols-1 gap-x-20 gap-y-16 lg:grid-cols-3">
            {/* Header Column */}
            <div className="flex flex-col gap-6">
                {eyebrow && <p className="text-sm font-medium text-blue-600">{eyebrow}</p>}
                <h2 className="max-w-4xl text-4xl font-medium tracking-tight">{heading}</h2>
                <p className="max-w-3xl text-lg text-gray-600">{description}</p>
            </div>

            {/* Features Columns */}
            <div className="lg:col-span-2">
                <div className="grid grid-cols-1 gap-12 sm:grid-cols-2">
                    {features.map((feature, index) => (
                        <FeatureItem
                            key={`${feature.title}-${index}`}
                            title={feature.title}
                            description={feature.description}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FeaturesList;
