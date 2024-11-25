import { Asterisk } from "lucide-react";
import { type LucideIcon } from "lucide-react";

interface Feature {
    name: string;
    description: string;
    icon: LucideIcon;
    bgColor: string;
}

interface FeaturesProps {
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

const Features = ({
    videoOnLeft = false,
    features,
    title,
    subtitle,
    badge,
    videoUrl,
}: FeaturesProps) => {
    const BadgeIcon = badge.icon ?? Asterisk;

    return (
        <div className="flex flex-col gap-20">
            <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-20">
                {videoOnLeft && (
                    <div className="flex w-full flex-1 justify-start">
                        <video
                            src={videoUrl}
                            width={928}
                            height={522}
                            className="rounded-lg shadow-2xl"
                            autoPlay
                            muted
                            loop
                        />
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
                        <video
                            src={videoUrl}
                            width={928}
                            height={522}
                            className="rounded-lg shadow-2xl"
                            autoPlay
                            muted
                            loop
                        />
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
                {features.map((feature) => (
                    <div key={feature.name} className="flex gap-4">
                        <div className="flex-shrink-0">
                            <div className={`${feature.bgColor} rounded-lg p-2`}>
                                <feature.icon
                                    className={`h-6 w-6 ${badge.textColor ?? "text-purple-600"}`}
                                    aria-hidden="true"
                                />
                            </div>
                        </div>
                        <div>
                            <span className="font-medium">{feature.name}</span>{" "}
                            <span className="text-gray-600">{feature.description}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Features;
