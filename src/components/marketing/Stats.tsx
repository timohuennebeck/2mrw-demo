import React from "react";

interface Stat {
    value: string;
    label: string;
    description: string;
    className: string;
}

interface StatsProps {
    title: string;
    eyebrow: string;
    description: string;
    stats: Stat[];
}

export default function StatsSection({ title, eyebrow = "Stats", description, stats }: StatsProps) {
    return (
        <div className="flex flex-col gap-16">
            {/* Header Section */}
            <div className="flex flex-col gap-6">
                <p className="text-sm font-medium text-blue-600">{eyebrow}</p>
                <h2 className="max-w-4xl text-4xl font-medium tracking-tight md:text-5xl">
                    {title}
                </h2>
                <p className="max-w-3xl text-lg">{description}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-12 sm:grid-rows-4">
                {stats.map((stat, index) => (
                    <div key={index} className={getColumnClassName(index)}>
                        <StatCard {...stat} heightClass={index !== 0 ? "h-full" : ""} />
                    </div>
                ))}
            </div>
        </div>
    );
}

// Helper function to determine column classes
function getColumnClassName(index: number): string {
    switch (index) {
        case 0:
            return "sm:col-span-3 sm:row-span-2 sm:row-start-3";
        case 1:
            return "sm:col-span-4 sm:row-span-4 sm:row-start-1";
        case 2:
            return "sm:col-span-5 sm:row-span-3 sm:row-start-2";
        default:
            return "";
    }
}

interface StatCardProps {
    value: string;
    label: string;
    description: string;
    className?: string;
    heightClass?: string;
}

function StatCard({ value, label, description, className, heightClass = "" }: StatCardProps) {
    return (
        <div className={`${className} ${heightClass} flex flex-col justify-between gap-4`}>
            <p className="text-4xl font-semibold tracking-tight">{value}</p>
            <div className="flex flex-col gap-2">
                <p className="text-lg font-semibold">{label}</p>
                <p className="text-base text-gray-400">{description}</p>
            </div>
        </div>
    );
}
