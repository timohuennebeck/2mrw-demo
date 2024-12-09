import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CurrentSubscriptionPlanParams {
    plan?: {
        name: string;
        status: string;
        description: string;
        price: string;
        billingInterval: "monthly" | "yearly" | "one-time";
        paymentMethod: {
            type: string;
            last4: string;
        };
    };
}

const CurrentSubscriptionPlan = ({ plan }: CurrentSubscriptionPlanParams) => {
    const mockPlan = {
        name: "Enterprise Plan",
        status: "ACTIVE",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto, sit!",
        price: "€300.00",
        billingInterval: "monthly" as const,
        paymentMethod: {
            type: "VISA",
            last4: "**52",
        },
    };

    const currentPlan = plan || mockPlan;

    return (
        <Card className="w-full border-none shadow-none">
            <CardContent>
                <div className="flex flex-col space-y-8">
                    {/* Header Section */}
                    <div className="flex justify-between gap-20">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <h3 className="text-2xl font-semibold">{currentPlan.name}</h3>
                                <Badge variant="default" className="flex items-center gap-1">
                                    {currentPlan.status}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground/80">
                                {currentPlan.description}
                            </p>
                        </div>
                    </div>

                    {/* Billing Info */}
                    <div className="space-y-2">
                        <p className="text-3xl font-semibold tracking-tight">
                            {currentPlan.price}
                            <span className="ml-1 text-sm text-muted-foreground">
                                {currentPlan.billingInterval === "one-time"
                                    ? ""
                                    : `/${currentPlan.billingInterval.slice(0, 5)}`}
                            </span>
                        </p>
                    </div>

                    <Button
                        variant="secondary"
                        size="sm"
                        className="transition-colors hover:bg-secondary/80"
                    >
                        Change Plan
                    </Button>

                    {/* Payment Info */}
                    <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex h-6 w-10 items-center justify-center rounded border">
                                <span className="text-xs">{currentPlan.paymentMethod.type}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                                ending in {currentPlan.paymentMethod.last4}
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default CurrentSubscriptionPlan;
