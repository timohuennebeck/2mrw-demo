import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DefaultPricingPlan, PricingFeatureSection } from "@/data/marketing/pricing-data";
import { getBillingPeriodText, getPlanPriceDescription } from "@/utils/pricing/pricingHelper";
import { Check, X } from "lucide-react";
import PricingPlanButton from "../application/PricingPlanButton";

const _toTitleCase = (text: string): string => {
    if (!text) return text;

    return text
        .toLowerCase()
        .split(" ")
        .map((word) => (word.length > 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word))
        .join(" ");
};

const PricingCard = ({
    plan,
    features,
    annualPlans,
    isUserLoggedIn,
    currentPlanStripePriceId,
}: {
    plan: DefaultPricingPlan;
    features: PricingFeatureSection[];
    annualPlans: DefaultPricingPlan[];
    isUserLoggedIn: boolean;
    currentPlanStripePriceId: string;
}) => {
    const annualPlan = annualPlans.find((p) => p.name === plan.name)?.price;
    const pricePerMonthForYearlyPlan = annualPlan
        ? `$${(Number(annualPlan.replace("$", "")) / 12).toFixed(2)}`
        : null;

    return (
        <Card className="shadow-none">
            <CardHeader>
                <CardTitle className="mb-4 font-medium text-lg">{_toTitleCase(plan.name)}</CardTitle>
                <div>
                    <span className="text-4xl font-medium">{plan.price}</span>
                    <span className="text-sm text-gray-500">
                        {getBillingPeriodText(plan.billing_period)}
                    </span>
                </div>
                <span className="block pt-2 text-sm text-gray-500">
                    {getPlanPriceDescription(plan, pricePerMonthForYearlyPlan)}
                </span>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col gap-4">
                {features.map((section) => (
                    <div key={section.category}>
                        <h4 className="mb-2 text-sm font-medium">{section.category}</h4>
                        <ul className="space-y-3">
                            {section.items.map((item) => {
                                const value = item[plan.name.toLowerCase() as keyof typeof item];
                                return (
                                    <li key={item.name} className="flex items-start gap-2">
                                        {typeof value === "boolean" ? (
                                            value ? (
                                                <Check className="h-5 w-5 text-black" />
                                            ) : (
                                                <X className="h-5 w-5 text-gray-400" />
                                            )
                                        ) : (
                                            <span className="text-sm">{value}</span>
                                        )}
                                        <span className="text-sm text-gray-600">{item.name}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </CardContent>

            <CardFooter>
                <PricingPlanButton
                    plan={plan}
                    currentPlanStripePriceId={currentPlanStripePriceId}
                    isUserLoggedIn={isUserLoggedIn}
                />
            </CardFooter>
        </Card>
    );
};

export default PricingCard;
