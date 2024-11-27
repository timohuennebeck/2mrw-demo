import { Check, X } from "lucide-react";

interface PricingPlan {
    name: string;
    price: string;
    period: string;
    buttonVariant: string;
}

interface PricingFeatureItem {
    name: string;
    starter: boolean | string;
    growth: boolean | string;
    scale: boolean | string;
}

interface PricingFeatureSection {
    category: string;
    items: PricingFeatureItem[];
}

interface PricingComparisonParams {
    title?: string;
    subtitle?: string;
    description?: string;
    plans: PricingPlan[];
    features: PricingFeatureSection[];
    buttonText?: string;
}

const PricingPlanHeader = ({ plan, buttonText }: { plan: PricingPlan; buttonText: string }) => (
    <div className="col-span-1 flex flex-col gap-6 text-center">
        <h3 className="text-lg font-medium">{plan.name}</h3>
        <div>
            <span className="text-4xl font-medium">{plan.price}</span>
            <span className="text-sm text-gray-500">{plan.period}</span>
        </div>
        <button
            className={`w-full rounded-md px-6 py-2.5 text-sm transition-colors ${
                plan.buttonVariant === "primary"
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
            }`}
        >
            {buttonText}
        </button>
    </div>
);

const FeatureCell = ({ value }: { value: boolean | string }) => {
    if (typeof value === "boolean") {
        return value ? (
            <Check className="mx-auto h-5 w-5 text-black" />
        ) : (
            <X className="mx-auto h-5 w-5 text-gray-400" />
        );
    }
    return <span className="text-sm">{value}</span>;
};

const FeatureRow = ({ item }: { item: PricingFeatureItem }) => (
    <div className="grid grid-cols-4 gap-8 py-6">
        <div className="col-span-1 text-sm text-gray-600">{item.name}</div>
        <div className="col-span-1 text-center">
            <FeatureCell value={item.starter} />
        </div>
        <div className="col-span-1 text-center">
            <FeatureCell value={item.growth} />
        </div>
        <div className="col-span-1 text-center">
            <FeatureCell value={item.scale} />
        </div>
    </div>
);

const PricingComparison = ({
    title = "Lorem ipsum dolor sit amet.",
    subtitle = "Pricing",
    description = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci optio nisi illum animi similique? Minus pariatur tempore aspernatur minima rerum!",
    plans,
    features,
    buttonText = "Buy plan",
}: PricingComparisonParams) => {
    return (
        <div className="flex flex-col gap-16">
            {/* Header Section */}
            <div className="flex flex-col gap-6 text-start">
                <p className="text-sm font-medium text-blue-600">{subtitle}</p>
                <h2 className="text-4xl font-medium tracking-tight md:text-5xl">{title}</h2>
                <p className="max-w-4xl text-lg text-gray-600">{description}</p>
            </div>

            {/* Plan Headers */}
            <div className="grid grid-cols-4 gap-8">
                <div className="col-span-1" />
                {plans.map((plan) => (
                    <PricingPlanHeader key={plan.name} plan={plan} buttonText={buttonText} />
                ))}
            </div>

            {/* Feature Comparison */}
            <div className="flex flex-col gap-12">
                {features.map((section) => (
                    <div key={section.category} className="flex flex-col gap-4">
                        <h4 className="text-base font-medium">{section.category}</h4>
                        <div className="divide-y divide-gray-200">
                            {section.items.map((item) => (
                                <FeatureRow key={item.name} item={item} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PricingComparison;
