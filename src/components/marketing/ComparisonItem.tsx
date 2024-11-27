import { Check, X } from "lucide-react";

interface ComparisonItemParams {
    type: "before" | "after";
    title?: string;
    bulletPoints: {
        text: string;
    }[];
    imagePath: string;
}

const ComparisonItem = ({ type, title, bulletPoints, imagePath }: ComparisonItemParams) => {
    const styles = {
        before: {
            bg: "bg-red-100",
            text: "text-red-600",
            icon: <X className="mt-1 h-4 w-4 flex-shrink-0 text-red-500" />,
            label: "BEFORE",
        },
        after: {
            bg: "bg-blue-50",
            text: "text-blue-600",
            icon: <Check className="mt-1 h-4 w-4 flex-shrink-0 text-blue-600" />,
            label: "AFTER",
        },
    };

    const currentStyle = styles[type];

    return (
        <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                    <div
                        className={`rounded-lg ${currentStyle.bg} px-3 py-1 text-sm font-medium ${currentStyle.text}`}
                    >
                        {currentStyle.label}
                    </div>
                    <h3 className="text-xl font-medium">{title}</h3>
                </div>
                <ul className="space-y-3">
                    {bulletPoints.map((point, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-600">
                            {currentStyle.icon}
                            {point.text}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border shadow-lg">
                <video
                    src={imagePath}
                    width={1200}
                    height={675}
                    className="rounded-lg shadow-2xl"
                    autoPlay
                    muted
                    loop
                />
            </div>
        </div>
    );
};

export default ComparisonItem;
