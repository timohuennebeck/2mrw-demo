import React from "react";
import { CheckBadgeIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Feature } from "@/interfaces/ProductInterfaces";

export const PlanFeatures = ({ features }: { features: Feature[] }) => (
    <ul className="flex flex-col gap-3" aria-label="Plan features">
        {features.map(({ name, included }, index) => (
            <li key={index} className="flex items-center gap-2">
                {included ? (
                    <CheckBadgeIcon className="w-5 h-5 text-black" aria-hidden="true" />
                ) : (
                    <XMarkIcon className="w-5 h-5 text-neutral-400" aria-hidden="true" />
                )}
                <span className={`text-sm ${included ? "text-neutral-600" : "text-neutral-400"}`}>
                    {name}
                </span>
            </li>
        ))}
    </ul>
);
