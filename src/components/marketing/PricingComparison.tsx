import { Check, X } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { DefaultPricingPlan, PricingFeatureItem, PricingFeatureSection } from "@/data/marketing/pricing-data";

interface PricingComparisonParams {
    title: React.ReactNode;
    subtitle: string;
    description: string;
    plans: {
        monthly: DefaultPricingPlan[];
        annual: DefaultPricingPlan[];
        oneTime: DefaultPricingPlan[];
    };
    features: PricingFeatureSection[];
    buttonText: string;
}

const PricingPlanHeader = ({
    plan,
    annualPlans,
    buttonText,
    onClick,
}: {
    plan: DefaultPricingPlan;
    annualPlans: DefaultPricingPlan[];
    buttonText: string;
    onClick: () => void;
}) => {
    const annualPlan = annualPlans.find((p) => p.name === plan.name)?.price;
    const pricePerMonthForYearlyPlan = annualPlan
        ? `$${(Number(annualPlan.replace("$", "")) / 12).toFixed(2)}`
        : null;

    return (
        <div className="col-span-1 flex flex-col gap-6">
            <h3 className="text-lg font-medium">{plan.name}</h3>
            <div>
                <span className="text-4xl font-medium">{plan.price}</span>
                <span className="text-sm text-gray-500">{plan.billing_period}</span>
            </div>
            <span className="text-sm text-gray-500">
                {plan.stripe_price_id === "price_free"
                    ? "Free Forever"
                    : `${pricePerMonthForYearlyPlan} / month when billed per annum`}
            </span>
            <Button
                size="lg"
                variant={plan.is_highlighted ? "default" : "outline"}
                onClick={onClick}
            >
                {buttonText}
            </Button>
        </div>
    );
};

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
            <FeatureCell value={item.free} />
        </div>
        <div className="col-span-1 text-center">
            <FeatureCell value={item.pro} />
        </div>
        <div className="col-span-1 text-center">
            <FeatureCell value={item.enterprise} />
        </div>
    </div>
);

const PricingComparison = ({
    title,
    subtitle,
    description,
    plans,
    features,
    buttonText,
}: PricingComparisonParams) => {
    return (
        <div className="flex flex-col gap-16">
            {/* Header Section */}
            <div className="flex flex-col gap-6 text-start">
                <p className="text-sm font-medium text-blue-600">{subtitle}</p>
                <h2 className="max-w-4xl text-4xl font-medium leading-tight tracking-tight md:text-5xl">
                    {title}
                </h2>
                <p className="max-w-4xl text-lg text-gray-600">{description}</p>
            </div>

            {/* Plan Headers */}
            <div className="grid grid-cols-4 gap-8">
                <div className="col-span-1" />
                {plans.monthly.map((plan) => (
                    <PricingPlanHeader
                        key={plan.name}
                        plan={plan}
                        annualPlans={plans.annual}
                        buttonText={buttonText}
                        onClick={plan.onClick}
                    />
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
