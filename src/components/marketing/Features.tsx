import { Asterisk } from "lucide-react";
import { type LucideIcon } from "lucide-react";
import CustomVideo from "../ui/custom-video";

interface Feature {
    name: string;
    description: string;
    icon: LucideIcon;
    bgColor: string;
}

interface FeaturesParams {
    videoOnLeft?: boolean;
    features: Feature[];
    title: string;
    subtitle: string;
    badge: {
        text: string;
        icon?: LucideIcon;
        bgColor?: string;
        textColor?: string;
    };
    videoUrl: string;
}

const FeatureItem = ({
    feature,
    badgeTextColor,
}: {
    feature: Feature;
    badgeTextColor?: string;
}) => (
    <div className="flex gap-4">
        <div className="flex-shrink-0">
            <div className={`${feature.bgColor} rounded-lg p-2`}>
                <feature.icon
                    className={`h-6 w-6 ${badgeTextColor ?? "text-purple-600"}`}
                    aria-hidden="true"
                />
            </div>
        </div>
        <div>
            <span className="font-medium">{feature.name}</span>{" "}
            <span className="text-gray-600">{feature.description}</span>
        </div>
    </div>
);

const Features = ({
    videoOnLeft = false,
    features,
    title,
    subtitle,
    badge,
    videoUrl,
}: FeaturesParams) => {
    const BadgeIcon = badge.icon ?? Asterisk;

    return (
        <div className="flex flex-col gap-20">
            <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-20">
                {videoOnLeft && (
                    <div className="flex w-full flex-1 justify-start">
                        <CustomVideo src={videoUrl} />
                    </div>
                )}

                <div className="flex flex-1 flex-col gap-6">
                    <div className="flex items-center gap-2">
                        <div className={`rounded-lg ${badge.bgColor ?? "bg-purple-50"} p-2`}>
                            <BadgeIcon
                                className={`h-5 w-5 ${badge.textColor ?? "text-purple-600"}`}
                            />
                        </div>
                        <span
                            className={`text-sm font-medium uppercase ${badge.textColor ?? "text-purple-600"}`}
                        >
                            {badge.text}
                        </span>
                    </div>

                    <h2 className="max-w-4xl text-4xl font-medium tracking-tight md:text-5xl">
                        {title} <span className="text-gray-400">{subtitle}</span>
                    </h2>
                </div>

                {!videoOnLeft && (
                    <div className="flex w-full flex-1 justify-start">
                        <CustomVideo src={videoUrl} />
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
                {features.map((feature, index) => (
                    <FeatureItem
                        key={`${feature.name}-${index}`}
                        feature={feature}
                        badgeTextColor={badge.textColor}
                    />
                ))}
            </div>
        </div>
    );
};

export default Features;
