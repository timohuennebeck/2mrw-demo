import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DefaultPricingPlan, PricingFeatureSection } from "@/data/marketing/pricing-data";
import { BillingPeriod } from "@/enums";
import { Check, X } from "lucide-react";
import PricingPlanButton from "../application/PricingPlanButton";

const PricingCard = ({
    plan,
    features,
    annualPlans,
    isUserLoggedIn,
}: {
    plan: DefaultPricingPlan;
    features: PricingFeatureSection[];
    annualPlans: DefaultPricingPlan[];
    isUserLoggedIn: boolean;
}) => {
    const annualPlan = annualPlans.find((p) => p.name === plan.name)?.price;
    const pricePerMonthForYearlyPlan = annualPlan
        ? `$${(Number(annualPlan.replace("$", "")) / 12).toFixed(2)}`
        : null;

    return (
        <Card className="shadow-none">
            <CardHeader>
                <CardTitle className="mb-4">{plan.name}</CardTitle>
                <div>
                    <span className="text-4xl font-medium">{plan.price}</span>
                    <span className="text-sm text-gray-500">
                        {plan.billing_period === BillingPeriod.MONTHLY
                            ? "/month"
                            : plan.billing_period === BillingPeriod.YEARLY
                              ? "/year"
                              : "/lifetime"}
                    </span>
                </div>
                <span className="mt-2 block text-sm text-gray-500">
                    {plan.stripe_price_id === "price_free"
                        ? "Free Forever"
                        : `${pricePerMonthForYearlyPlan} / month when billed per annum`}
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
                    activePlanStripePriceId=""
                    isUserLoggedIn={isUserLoggedIn}
                />
            </CardFooter>
        </Card>
    );
};

export default PricingCard;
