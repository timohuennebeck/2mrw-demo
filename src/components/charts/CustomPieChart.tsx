"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
const chartData = [
    { plan: "enterprise", users: 275, fill: "var(--color-enterprise)" },
    { plan: "premium", users: 420, fill: "var(--color-premium)" },
    { plan: "pro", users: 287, fill: "var(--color-pro)" },
    { plan: "basic", users: 373, fill: "var(--color-basic)" },
    { plan: "free", users: 190, fill: "var(--color-free)" },
];

const chartConfig = {
    users: {
        label: "Active Users",
    },
    enterprise: {
        label: "Enterprise",
        color: "hsl(var(--chart-1))",
    },
    premium: {
        label: "Premium",
        color: "hsl(var(--chart-2))",
    },
    pro: {
        label: "Pro",
        color: "hsl(var(--chart-3))",
    },
    basic: {
        label: "Basic",
        color: "hsl(var(--chart-4))",
    },
    free: {
        label: "Free",
        color: "hsl(var(--chart-5))",
    },
} satisfies ChartConfig;

export function CustomPieChart() {
    const totalUsers = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.users, 0);
    }, []);

    return (
        <Card className="flex flex-1 flex-col shadow-none">
            <CardHeader className="items-center pb-0">
                <CardTitle>Subscription Distribution</CardTitle>
                <CardDescription>Lorem ipsum dolor sit amet.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Pie
                            data={chartData}
                            dataKey="users"
                            nameKey="plan"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {totalUsers.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Active Users
                                                </tspan>
                                            </text>
                                        );
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    12.5% Increase in Paid Plans
                </div>
                <div className="leading-none text-muted-foreground">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis, nisi.
                </div>
            </CardFooter>
        </Card>
    );
}
