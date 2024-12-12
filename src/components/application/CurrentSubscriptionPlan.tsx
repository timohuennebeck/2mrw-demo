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
        expirationDate: string;
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
        expirationDate: "2024-04-30",
    };

    const currentPlan = plan || mockPlan;

    return (
        <Card className="w-full border-none bg-transparent shadow-none">
            <CardContent className="p-0">
                <div className="flex flex-col space-y-6 md:space-y-8">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:justify-between md:gap-20">
                        <div className="space-y-2 md:space-y-3">
                            <div className="flex flex-col gap-2 md:flex-row md:items-center">
                                <h3 className="text-xl font-medium md:text-2xl">
                                    {currentPlan.name}
                                </h3>
                                <Badge variant="default" className="flex w-fit items-center gap-1">
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
                        <div className="flex items-baseline gap-1">
                            <p className="text-2xl font-medium tracking-tight md:text-3xl">
                                {currentPlan.price}
                            </p>
                            <span className="text-sm text-muted-foreground">
                                {currentPlan.billingInterval === "one-time"
                                    ? ""
                                    : `/${currentPlan.billingInterval.slice(0, 5)}`}
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Expires on {new Date(currentPlan.expirationDate).toLocaleDateString()}
                        </p>
                    </div>

                    <Button
                        variant="secondary"
                        size="sm"
                        className="w-full transition-colors hover:bg-secondary/80 md:w-auto"
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
