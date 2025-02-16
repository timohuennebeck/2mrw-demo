import { Asterisk, Check, X } from "lucide-react";
import CustomVideo from "../ui/custom-video";
import { appConfig } from "@/config";

interface ComparisonItemParams {
    type: "before" | "after";
    title?: string;
    bulletPoints: {
        text: string;
    }[];
    videoUrl?: string;
}

const ComparisonItem = ({ type, title, bulletPoints, videoUrl }: ComparisonItemParams) => {
    const styles = {
        before: {
            bg: "bg-gray-100 dark:bg-gray-900",
            text: "text-muted-foreground",
            icon: X,
            label: "ALTERNATIVES",
        },
        after: {
            bg: "bg-blue-50 dark:bg-blue-950/50",
            text: "text-blue-600",
            icon: Check,
            label: appConfig.company.name.toUpperCase(),
        },
    };

    const currentStyle = styles[type];
    const Icon = currentStyle.icon;

    return (
        <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <div className={`rounded-lg ${currentStyle.bg} p-2`}>
                            <Asterisk className={`h-5 w-5 ${currentStyle.text}`} />
                        </div>
                        <span className={`text-sm font-medium uppercase ${currentStyle.text}`}>
                            {currentStyle.label}
                        </span>
                    </div>
                    {title && <h3 className="text-xl font-medium">{title}</h3>}
                </div>
                <ul className="space-y-3">
                    {bulletPoints.map((point, index) => (
                        <li key={index} className="flex items-start gap-2 text-muted-foreground">
                            <Icon className={`mt-1 h-4 w-4 flex-shrink-0 ${currentStyle.text}`} />
                            {point.text}
                        </li>
                    ))}
                </ul>
            </div>
            {videoUrl && <CustomVideo src={videoUrl} />}
        </div>
    );
};

export default ComparisonItem;
