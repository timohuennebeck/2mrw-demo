"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

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
    { month: "January", customers: 186 },
    { month: "February", customers: 305 },
    { month: "March", customers: 437 },
    { month: "April", customers: 573 },
    { month: "May", customers: 709 },
    { month: "June", customers: 814 },
];

const chartConfig = {
    customers: {
        label: "Total Customers",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

export function CustomLinearLineChart() {
    return (
        <Card className="flex-1 shadow-none">
            <CardHeader>
                <CardTitle>Customer Growth</CardTitle>
                <CardDescription>Lorem ipsum dolor sit amet.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Line
                            dataKey="customers"
                            type="linear"
                            stroke="var(--color-customers)"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                    14.8% Customer Growth This Month
                </div>
                <div className="leading-none text-muted-foreground">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis, nisi.
                </div>
            </CardFooter>
        </Card>
    );
}
