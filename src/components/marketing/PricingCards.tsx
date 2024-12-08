import { Check, X } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface PricingPlan {
    name: string;
    price: string;
    period: string;
    buttonVariant: string;
    onClick: () => void;
    stripePriceId: string;
}

interface PricingFeatureSection {
    category: string;
    items: PricingFeatureItem[];
}

interface PricingFeatureItem {
    name: string;
    free: boolean | string;
    pro: boolean | string;
    enterprise: boolean | string;
}

interface PricingCardsProps {
    plans: {
        monthly: PricingPlan[];
        annual: PricingPlan[];
    };
    features: PricingFeatureSection[];
    buttonText: string;
}

const PricingCard = ({
    plan,
    features,
    buttonText,
    annualPlans,
}: {
    plan: PricingPlan;
    features: PricingFeatureSection[];
    buttonText: string;
    annualPlans: PricingPlan[];
}) => {
    const annualPlan = annualPlans.find((p) => p.name === plan.name)?.price;
    const pricePerMonthForYearlyPlan = annualPlan
        ? `$${(Number(annualPlan.replace("$", "")) / 12).toFixed(2)}`
        : null;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="mb-4">{plan.name}</CardTitle>
                <div>
                    <span className="text-4xl font-medium">{plan.price}</span>
                    <span className="text-sm text-gray-500">{plan.period}</span>
                </div>
                <span className="mt-2 block text-sm text-gray-500">
                    {plan.stripePriceId === "price_free"
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
                <Button
                    size="lg"
                    className={`w-full ${
                        plan.buttonVariant === "primary"
                            ? "bg-black text-white hover:bg-gray-800"
                            : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    }`}
                    onClick={plan.onClick}
                >
                    {buttonText}
                </Button>
            </CardFooter>
        </Card>
    );
};

const PricingCards = ({ plans, features, buttonText }: PricingCardsProps) => {
    return (
        <div className="grid gap-8 md:grid-cols-3">
            {plans.monthly.map((plan) => (
                <PricingCard
                    key={plan.name}
                    plan={plan}
                    features={features}
                    buttonText={buttonText}
                    annualPlans={plans.annual}
                />
            ))}
        </div>
    );
};

export default PricingCards;
