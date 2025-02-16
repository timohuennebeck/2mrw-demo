import React from "react";

interface Stat {
    value: string;
    label: string;
    description: string;
    className: string;
}

interface StatsParams {
    title: React.ReactNode;
    eyebrow?: string;
    description: string;
    stats: Stat[];
}

interface StatCardParams {
    value: string;
    label: string;
    description: string;
    className: string;
    heightClass?: string;
}

const StatCard = ({ value, label, description, className, heightClass = "" }: StatCardParams) => {
    return (
        <div className={`${className} ${heightClass} flex flex-col justify-between gap-4`}>
            <p className="text-4xl font-semibold tracking-tight">{value}</p>
            <div className="flex flex-col gap-2">
                <p className="text-lg font-semibold">{label}</p>
                <p className="text-base text-muted-foreground">{description}</p>
            </div>
        </div>
    );
};

const Stats = ({ title, eyebrow, description, stats }: StatsParams) => {
    return (
        <div className="flex flex-col gap-16">
            {/* Header Section */}
            <div className="flex flex-col gap-6">
                {eyebrow && <p className="text-sm font-medium text-blue-600">{eyebrow}</p>}
                <h2 className="max-w-4xl text-4xl font-medium tracking-tight md:text-5xl">
                    {title}
                </h2>
                <p className="max-w-3xl text-lg text-muted-foreground">{description}</p>
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
};

const getColumnClassName = (index: number): string => {
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
};

export default Stats;
