import React from "react";
import { CheckBadgeIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { PlanFeaturesParams } from "./PlanFeatures.interface";

export const PlanFeatures = ({ features }: PlanFeaturesParams) => (
    <ul className="flex flex-col gap-3" aria-label="Plan features">
        {features.map((feature) => (
            <li key={feature.id} className="flex items-center gap-2">
                {feature.isAvailable ? (
                    <CheckBadgeIcon className="h-5 w-5 text-black" aria-hidden="true" />
                ) : (
                    <XMarkIcon className="h-5 w-5 text-neutral-400" aria-hidden="true" />
                )}
                <div className={feature.isAvailable ? "" : "text-neutral-400"}>
                    <span className={`text-sm ${!feature.isAvailable && "line-through"}`}>
                        {feature.name}
                    </span>
                    {feature.description && (
                        <p className="text-xs text-neutral-400">{feature.description}</p>
                    )}
                </div>
            </li>
        ))}
    </ul>
);
