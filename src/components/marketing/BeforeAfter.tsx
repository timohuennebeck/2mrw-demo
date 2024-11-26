import { Code, Check, X } from "lucide-react";
import Image from "next/image";

interface BeforeAfterItem {
    title?: string;
    bulletPoints: {
        text: string;
    }[];
    imagePath: string;
}

interface BeforeAfterProps {
    heading?: {
        eyebrow?: string;
        title: string;
        titleHighlight?: string;
        description?: string;
    };
    before: BeforeAfterItem;
    after: BeforeAfterItem;
}

const BeforeAfter = ({ heading, before, after }: BeforeAfterProps) => {
    return (
        <div className="flex flex-col gap-20">
            {/* Header Section */}
            {heading && (
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-6">
                        {heading.eyebrow && (
                            <p className="text-sm font-medium text-blue-600">{heading.eyebrow}</p>
                        )}
                        <h2 className="max-w-4xl text-4xl font-medium tracking-tight md:text-5xl">
                            {heading.title}{" "}
                            {heading.titleHighlight && (
                                <span className="text-gray-400">{heading.titleHighlight}</span>
                            )}
                        </h2>
                    </div>
                    {heading.description && (
                        <p className="max-w-3xl text-lg text-gray-600">{heading.description}</p>
                    )}
                </div>
            )}

            {/* Before/After Grid */}
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                {/* Before Section */}
                <div className="flex flex-col gap-12">
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-red-100 px-3 py-1 text-sm font-medium text-red-600">
                                BEFORE
                            </div>
                            <h3 className="text-xl font-medium">{before.title}</h3>
                        </div>
                        <ul className="space-y-3">
                            {before.bulletPoints.map((point, index) => (
                                <li key={index} className="flex items-start gap-2 text-gray-600">
                                    <X className="mt-1 h-4 w-4 flex-shrink-0 text-red-500" />
                                    {point.text}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border shadow-lg">
                        <video
                            src={before.imagePath}
                            width={1200}
                            height={675}
                            className="rounded-lg shadow-2xl"
                            autoPlay
                            muted
                            loop
                        />
                    </div>
                </div>

                {/* After Section */}
                <div className="flex flex-col gap-12">
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600">
                                AFTER
                            </div>
                            <h3 className="text-xl font-medium">{after.title}</h3>
                        </div>
                        <ul className="space-y-3">
                            {after.bulletPoints.map((point, index) => (
                                <li key={index} className="flex items-start gap-2 text-gray-600">
                                    <Check className="mt-1 h-4 w-4 flex-shrink-0 text-blue-600" />
                                    {point.text}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border shadow-lg">
                        <video
                            src={after.imagePath}
                            width={1200}
                            height={675}
                            className="rounded-lg shadow-2xl"
                            autoPlay
                            muted
                            loop
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BeforeAfter;
