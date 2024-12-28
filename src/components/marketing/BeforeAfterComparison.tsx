import ComparisonItem from "./ComparisonItem";

interface BeforeAfterComparisonItem {
    title?: string;
    bulletPoints: {
        text: string;
    }[];
    videoUrl: string;
}

interface BeforeAfterComparisonParams {
    heading?: {
        eyebrow?: string;
        title: React.ReactNode;
        description: string;
    };
    before: BeforeAfterComparisonItem;
    after: BeforeAfterComparisonItem;
}

const BeforeAfterComparison = ({ heading, before, after }: BeforeAfterComparisonParams) => {
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
                            {heading.title}
                        </h2>
                    </div>
                    {heading.description && (
                        <p className="max-w-3xl text-lg text-gray-600">{heading.description}</p>
                    )}
                </div>
            )}

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                <ComparisonItem
                    type="before"
                    title={before.title}
                    bulletPoints={before.bulletPoints}
                    videoUrl={before.videoUrl}
                />
                <ComparisonItem
                    type="after"
                    title={after.title}
                    bulletPoints={after.bulletPoints}
                    videoUrl={after.videoUrl}
                />
            </div>
        </div>
    );
};

export default BeforeAfterComparison;
