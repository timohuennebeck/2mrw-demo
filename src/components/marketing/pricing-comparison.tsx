import {
    DefaultPricingPlan,
    isOneTimePaymentEnabled,
    PricingFeatureItem,
    PricingFeatureSection,
} from "@/config";
import { getBillingPeriodText } from "@/utils/pricing/pricing-helper";
import { Check, X, InfoIcon } from "lucide-react";
import React from "react";
import PricingPlanButton from "../application/pricing-plan-button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PricingComparisonParams {
    eyebrow: string;
    title: React.ReactNode;
    description: string;
    plans: {
        monthly: DefaultPricingPlan[];
        annual: DefaultPricingPlan[];
        oneTime: DefaultPricingPlan[];
    };
    features: PricingFeatureSection[];
    isUserLoggedIn: boolean;
    currentPlanStripePriceId: string;
}

const PricingPlanHeader = ({
    plan,
    isUserLoggedIn,
    currentPlanStripePriceId,
}: {
    plan: DefaultPricingPlan;
    isUserLoggedIn: boolean;
    currentPlanStripePriceId: string;
}) => {
    return (
        <div className="col-span-1 flex flex-col justify-between gap-6 md:gap-4">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-medium">{plan.name}</h3>
                    {plan.is_highlighted && (
                        <Badge variant="secondary" className="rounded-md font-medium">
                            Most Popular
                        </Badge>
                    )}
                </div>
            </div>
            <div>
                <span className="text-4xl font-medium">{plan.price}</span>
                <span className="text-sm text-gray-500">
                    {getBillingPeriodText(plan.billing_period)}
                </span>
            </div>
            <span className="text-sm text-gray-500">{plan.description}</span>
            <PricingPlanButton
                plan={plan}
                currentPlanStripePriceId={currentPlanStripePriceId ?? ""}
                isUserLoggedIn={isUserLoggedIn}
            />
        </div>
    );
};

const FeatureCell = ({
    value,
    isHighlighted,
}: {
    value: boolean | string;
    isHighlighted: boolean;
}) => {
    if (typeof value === "boolean") {
        return value ? (
            <Check className="mx-auto h-5 w-5 text-black" />
        ) : (
            <X className="mx-auto h-5 w-5 text-gray-400" />
        );
    }
    return <span className={`text-sm ${isHighlighted ? "font-semibold" : ""}`}>{value}</span>;
};

const FeatureRow = ({
    item,
    plansToShow,
}: {
    item: PricingFeatureItem;
    plansToShow: DefaultPricingPlan[];
}) => {
    return (
        <div className={`grid grid-cols-1 gap-8 py-6 md:grid-cols-${plansToShow.length + 1}`}>
            <div className="flex items-center gap-2 text-sm text-gray-600">
                {item.name}
                {item.tooltip && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <InfoIcon className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="max-w-xs text-sm">{item.tooltip}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
                {item.comingSoon && (
                    <Badge variant="blue" className="rounded-md font-medium">
                        Coming Soon
                    </Badge>
                )}
            </div>
            {plansToShow.map((plan, index) => (
                <div
                    key={`${plan.subscription_tier}-${index}`}
                    className="flex items-center md:justify-center"
                >
                    <span className="flex-1 text-sm text-gray-500 md:hidden">{plan.name}</span>
                    <div className="ml-auto md:ml-0">
                        <FeatureCell
                            value={item[plan.subscription_tier]}
                            isHighlighted={plan.is_highlighted}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

const PricingComparison = ({
    eyebrow,
    title,
    description,
    plans,
    features,
    isUserLoggedIn,
    currentPlanStripePriceId,
}: PricingComparisonParams) => {
    const isOneTimePayment = isOneTimePaymentEnabled();
    const plansToShow = isOneTimePayment ? plans.oneTime : plans.monthly;

    const numberOfColumns = plansToShow.length + 1;

    return (
        <div className="flex flex-col gap-8 md:gap-16">
            {/* Header Section */}
            <div className="flex flex-col gap-4 text-start md:gap-6">
                {eyebrow && <p className="text-sm font-medium text-blue-600">{eyebrow}</p>}
                <h2 className="max-w-4xl text-4xl font-medium leading-tight tracking-tight md:text-5xl">
                    {title}
                </h2>
                <p className="max-w-4xl text-lg text-gray-600">{description}</p>
            </div>

            {/* Plan Headers */}
            <div className={`grid grid-cols-1 gap-8 md:grid-cols-${numberOfColumns}`}>
                <div className="col-span-1 hidden md:block" />
                {plansToShow.map((plan, index) => (
                    <PricingPlanHeader
                        key={`${plan.subscription_tier}-${index}`}
                        plan={plan}
                        isUserLoggedIn={isUserLoggedIn}
                        currentPlanStripePriceId={currentPlanStripePriceId}
                    />
                ))}
            </div>

            {/* Feature Rows */}
            {features.map((section) => (
                <div key={section.category}>
                    <h3 className="mb-4 text-sm font-medium">{section.category}</h3>
                    {section.items.map((item) => (
                        <FeatureRow key={item.name} item={item} plansToShow={plansToShow} />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default PricingComparison;
