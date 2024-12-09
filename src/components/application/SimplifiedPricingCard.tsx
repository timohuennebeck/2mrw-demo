import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BadgeCheck } from "lucide-react";

interface SimplifiedPricingCardProps {
    plan?: {
        name: string;
        status: string;
        description: string;
        price: string;
        billingInterval: "monthly" | "yearly" | "one-time";
        paymentMethod: {
            type: string;
            last4: string;
            bank: string;
        };
    };
}

const SimplifiedPricingCard = ({ plan }: SimplifiedPricingCardProps) => {
    const mockPlan = {
        name: "Enterprise Plan",
        status: "ACTIVE",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto, sit!",
        price: "$300.00",
        billingInterval: "monthly" as const,
        paymentMethod: {
            type: "VISA",
            last4: "**52",
            bank: "HSBC Bank",
        },
    };

    const currentPlan = plan || mockPlan;

    return (
        <Card className="w-full shadow-none">
            <CardContent className="p-6">
                <div className="flex flex-col space-y-6">
                    {/* Header Section */}
                    <div className="flex justify-between gap-20">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-2">
                                    <BadgeCheck className="h-5 w-5" />
                                    <h3 className="text-xl font-semibold">{currentPlan.name}</h3>
                                </div>
                                <Badge variant="default">{currentPlan.status}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {currentPlan.description}
                            </p>
                        </div>
                        <div className="text-right">
                            <Button variant="secondary" size="sm">
                                Change Plan
                            </Button>
                        </div>
                    </div>

                    {/* Billing Info */}
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <div className="">
                                <p className="text-2xl font-semibold">
                                    {currentPlan.price}
                                    <span className="text-sm text-muted-foreground">
                                        {currentPlan.billingInterval === "one-time"
                                            ? ""
                                            : `/${currentPlan.billingInterval.slice(0, 5)}`}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Company Info */}
                    <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex h-6 w-10 items-center justify-center rounded border">
                                <span className="text-xs">{currentPlan.paymentMethod.type}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                                ending in {currentPlan.paymentMethod.last4}
                            </span>
                            <span className="text-sm text-muted-foreground">
                                • {currentPlan.paymentMethod.bank}
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default SimplifiedPricingCard;
