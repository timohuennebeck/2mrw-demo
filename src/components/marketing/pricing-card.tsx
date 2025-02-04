import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DefaultPricingPlan, PricingFeatureItem, PricingFeatureSection } from "@/config";
import { getBillingPeriodText } from "@/utils/pricing/pricing-helper";
import { Check, X, InfoIcon } from "lucide-react";
import PricingPlanButton from "../application/pricing-plan-button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface PricingCardProps {
    plan: DefaultPricingPlan;
    features: PricingFeatureItem[];
    isUserLoggedIn: boolean;
    currentPlanStripePriceId: string;
}

const PricingCardHeader = ({ plan }: { plan: DefaultPricingPlan }) => (
    <CardHeader>
        <CardTitle className="mb-4 text-lg font-medium">{plan.name}</CardTitle>
        <div>
            <span className="text-4xl font-medium">{plan.price}</span>
            <span className="text-sm text-muted-foreground">
                {getBillingPeriodText(plan.billing_period)}
            </span>
        </div>
        <span className="block pt-2 text-sm text-muted-foreground">{plan.description}</span>
    </CardHeader>
);

const PricingCardAvailability = ({ value }: { value: string }) =>
    typeof value === "boolean" ? (
        value ? (
            <Check className="h-5 w-5" />
        ) : (
            <X className="h-5 w-5 text-muted-foreground" />
        )
    ) : (
        <span className="text-sm">{value}</span>
    );

const PricingCard = ({
    plan,
    features,
    isUserLoggedIn,
    currentPlanStripePriceId,
}: PricingCardProps) => {
    return (
        <Card className="shadow-none dark:bg-background border border-border">
            <PricingCardHeader plan={plan} />

            <CardContent className="flex flex-1 flex-col gap-4">
                {features.map((feature) => {
                    const value: string = feature[plan.subscription_tier];

                    return (
                        <div key={feature.name}>
                            <ul className="space-y-3">
                                <li key={feature.name} className="flex items-start gap-2">
                                    <PricingCardAvailability value={value} />

                                    <div className="flex items-center gap-1">
                                        <span className="text-sm text-muted-foreground">
                                            {feature.name}
                                        </span>
                                        {feature.tooltip && (
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <InfoIcon className="h-4 w-4 text-muted-foreground" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p className="max-w-xs text-sm">
                                                            {feature.tooltip}
                                                        </p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}
                                        {feature.comingSoon && (
                                            <Badge
                                                variant="blue"
                                                className="rounded-md font-medium"
                                            >
                                                Coming Soon
                                            </Badge>
                                        )}
                                    </div>
                                </li>
                            </ul>
                        </div>
                    );
                })}
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
