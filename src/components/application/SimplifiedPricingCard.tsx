import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BadgeCheck } from "lucide-react";

interface SimplifiedPricingCardProps {
    plan?: {
        name: string;
        status: string;
        description: string;
        nextPayment: string;
        lastInvoice: string;
        price: string;
        billingInterval: "monthly" | "yearly" | "one-time";
        details: {
            accounts: number;
            planType: string;
            addons: number;
            lastUpdate: string;
        };
        company: {
            name: string;
            email: string;
            paymentMethod: {
                type: string;
                last4: string;
                bank: string;
            };
        };
    };
}

const SimplifiedPricingCard = ({ plan }: SimplifiedPricingCardProps) => {
    // Mock data for development
    const mockPlan = {
        name: "Enterprise Plan",
        status: "ACTIVE",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto, sit!",
        nextPayment: "4 December 2025",
        lastInvoice: "04-12-2024",
        price: "$300.00",
        billingInterval: "monthly" as const,
        details: {
            accounts: 4,
            planType: "Enterprise plan",
            addons: 8,
            lastUpdate: "Sat, 4 December at 10:30 AM",
        },
        company: {
            name: "Superspark",
            email: "Superspark@mincorp.com",
            paymentMethod: {
                type: "VISA",
                last4: "**52",
                bank: "HSBC Bank",
            },
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
                                Change plan
                            </Button>
                        </div>
                    </div>

                    {/* Billing Info */}
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            {/* <div>
                                <p className="text-sm font-medium">Upcoming Invoice:</p>
                                <p className="text-sm text-muted-foreground">
                                    {currentPlan.nextPayment}
                                </p>
                            </div> */}
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
                                <span className="text-xs">
                                    {currentPlan.company.paymentMethod.type}
                                </span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                                ending in {currentPlan.company.paymentMethod.last4}
                            </span>
                            <span className="text-sm text-muted-foreground">
                                • {currentPlan.company.paymentMethod.bank}
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default SimplifiedPricingCard;
