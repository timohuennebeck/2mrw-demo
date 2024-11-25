import React from "react";

const stats = [
    {
        value: "250k",
        label: "Users on the platform",
        description: "Vel labore deleniti veniam consequuntur sunt nobis.",
        className: "bg-gray-50 rounded-lg p-8",
    },
    {
        value: "$8.9 billion",
        label: "We're proud that our customers have made over $8 billion in total revenue.",
        description: "Eu duis porta aliquam ornare. Elementum eget magna egestas.",
        className: "bg-gray-900 text-white rounded-lg p-8",
    },
    {
        value: "401,093",
        label: "Transactions this year",
        description:
            "Eu duis porta aliquam ornare. Elementum eget magna egestas. Eu duis porta aliquam ornare.",
        className: "bg-blue-600 text-white rounded-lg p-8",
    },
];

export default function StatsSection() {
    return (
        <div className="flex flex-col gap-16">
            {/* Header Section */}
            <div className="flex flex-col gap-6">
                <p className="text-sm font-medium text-blue-600">Stats</p>
                <h2 className="text-4xl max-w-4xl font-medium tracking-tight md:text-5xl">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </h2>
                <p className="text-lg max-w-3xl text-gray-600">
                    Diam nunc lacus lacus aliquam turpis enim. Eget hac velit est euismod lacus. Est
                    non placerat nam arcu. Cras purus nibh cursus sit eu in id. Integer vel nibh.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-12 sm:grid-rows-4">
                {/* First column - base size (2 rows tall) */}
                <div className="sm:col-span-3 sm:row-span-2 sm:row-start-3">
                    <StatCard {...stats[0]} />
                </div>

                {/* Second column - 1.5x width, 2x height (4 rows tall) */}
                <div className="sm:col-span-4 sm:row-span-4 sm:row-start-1">
                    <StatCard {...stats[1]} heightClass="h-full" />
                </div>

                {/* Third column - 2x width, 1.5x height (3 rows tall) */}
                <div className="sm:col-span-5 sm:row-span-3 sm:row-start-2">
                    <StatCard {...stats[2]} heightClass="h-full" />
                </div>
            </div>
        </div>
    );
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
                <p className="text-base text-gray-300">{description}</p>
            </div>
        </div>
    );
}
