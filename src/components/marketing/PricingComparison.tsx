import { isFreePlanEnabled, isOneTimePaymentEnabled } from "@/config";
import {
    DefaultPricingPlan,
    PricingFeatureItem,
    PricingFeatureSection,
} from "@/config/pricing.config";
import { getBillingPeriodText, getPlanPriceDescription } from "@/utils/pricing/pricingHelper";
import { Check, X } from "lucide-react";
import React from "react";
import PricingPlanButton from "../application/PricingPlanButton";

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
    isUserLoggedIn: boolean;
    currentPlanStripePriceId: string;
}

const PricingPlanHeader = ({
    plan,
    annualPlans,
    isUserLoggedIn,
    currentPlanStripePriceId,
}: {
    plan: DefaultPricingPlan;
    annualPlans: DefaultPricingPlan[];
    isUserLoggedIn: boolean;
    currentPlanStripePriceId: string;
}) => {
    const annualPlan = annualPlans.find((p) => p.name === plan.name)?.price;
    const pricePerMonthForYearlyPlan = annualPlan
        ? `$${(Number(annualPlan.replace("$", "")) / 12).toFixed(2)}`
        : null;

    return (
        <div className="col-span-1 flex flex-col justify-between gap-6 md:gap-4">
            <h3 className="text-lg font-medium">{plan.name}</h3>
            <div>
                <span className="text-4xl font-medium">{plan.price}</span>
                <span className="text-sm text-gray-500">
                    {getBillingPeriodText(plan.billing_period)}
                </span>
            </div>
            <span className="text-sm text-gray-500">
                {getPlanPriceDescription(plan, pricePerMonthForYearlyPlan)}
            </span>
            <PricingPlanButton
                plan={plan}
                currentPlanStripePriceId={currentPlanStripePriceId ?? ""}
                isUserLoggedIn={isUserLoggedIn}
            />
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

const FeatureRow = ({
    item,
    showFreePlan,
}: {
    item: PricingFeatureItem;
    showFreePlan: boolean;
}) => (
    <div
        className={`grid gap-8 py-6 ${
            showFreePlan ? "grid-cols-1 md:grid-cols-4" : "grid-cols-1 md:grid-cols-3"
        }`}
    >
        <div className="flex items-center text-sm text-gray-600">{item.name}</div>
        {showFreePlan && (
            <div className="flex items-center md:justify-center">
                <span className="flex-1 text-sm text-gray-500 md:hidden">Free</span>
                <div className="ml-auto md:ml-0">
                    <FeatureCell value={item.free ?? false} />
                </div>
            </div>
        )}
        <div className="flex items-center md:justify-center">
            <span className="flex-1 text-sm text-gray-500 md:hidden">Pro</span>
            <div className="ml-auto md:ml-0">
                <FeatureCell value={item.pro} />
            </div>
        </div>
        <div className="flex items-center md:justify-center">
            <span className="flex-1 text-sm text-gray-500 md:hidden">Enterprise</span>
            <div className="ml-auto md:ml-0">
                <FeatureCell value={item.enterprise} />
            </div>
        </div>
    </div>
);

const PricingComparison = ({
    title,
    subtitle,
    description,
    plans,
    features,
    isUserLoggedIn,
    currentPlanStripePriceId,
}: PricingComparisonParams) => {
    const showFreePlan = isFreePlanEnabled();
    const isOneTimePayment = isOneTimePaymentEnabled();

    const plansToShow = isOneTimePayment ? plans.oneTime : plans.monthly;

    return (
        <div className="flex flex-col gap-8 md:gap-16">
            {/* Header Section */}
            <div className="flex flex-col gap-4 text-start md:gap-6">
                <p className="text-sm font-medium text-blue-600">{subtitle}</p>
                <h2 className="max-w-4xl text-4xl font-medium leading-tight tracking-tight md:text-5xl">
                    {title}
                </h2>
                <p className="max-w-4xl text-lg text-gray-600">{description}</p>
            </div>

            {/* Plan Headers */}
            <div
                className={`grid gap-8 ${
                    showFreePlan ? "grid-cols-1 md:grid-cols-4" : "grid-cols-1 md:grid-cols-3"
                }`}
            >
                <div className="col-span-1 hidden md:block" />
                {plansToShow.map((plan) => (
                    <PricingPlanHeader
                        key={plan.name}
                        plan={plan}
                        annualPlans={plans.annual}
                        isUserLoggedIn={isUserLoggedIn}
                        currentPlanStripePriceId={currentPlanStripePriceId}
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
                                <FeatureRow
                                    key={item.name}
                                    item={item}
                                    showFreePlan={showFreePlan}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PricingComparison;
