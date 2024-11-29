"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

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
    { month: "January", premium: 85, basic: 18 },
    { month: "February", premium: 51, basic: 192 },
    { month: "March", premium: 51, basic: 151 },
    { month: "April", premium: 15, basic: 52 },
    { month: "May", premium: 12, basic: 95 },
    { month: "June", premium: 95, basic: 51 },
];

const chartConfig = {
    premium: {
        label: "Premium Plan",
        color: "hsl(var(--chart-1))",
    },
    basic: {
        label: "Basic Plan",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

export function CustomBarChart() {
    return (
        <Card className="h-full flex-1 rounded-none shadow-none">
            <CardHeader>
                <CardTitle>MRR</CardTitle>
                <CardDescription>Lorem ipsum dolor sit amet.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <Bar dataKey="premium" fill="var(--color-premium)" radius={4} />
                        <Bar dataKey="basic" fill="var(--color-basic)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                    MRR Growth of 15.8% This Month
                </div>
                <div className="leading-none text-muted-foreground">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis, nisi.
                </div>
            </CardFooter>
        </Card>
    );
}
