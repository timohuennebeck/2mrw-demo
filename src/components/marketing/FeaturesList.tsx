import { Check } from "lucide-react";

const features = [
    {
        title: "Invite team members",
        description: "Rerum repellat labore necessitatibus reprehenderit molestiae praesentium.",
    },
    {
        title: "List view",
        description:
            "Corporis asperiores ea nulla temporibus asperiores non tempore assumenda aut.",
    },
    {
        title: "Keyboard shortcuts",
        description:
            "In sit qui aliquid deleniti et. Ad nobis sunt omnis. Quo sapiente dicta laboriosam.",
    },
    {
        title: "Calendars",
        description: "Sed rerum sunt dignissimos ullam. Iusto iure occaecati voluptate eligendi.",
    },
    {
        title: "Notifications",
        description: "Quos inventore harum enim nesciunt. Aut repellat rerum omnis adipisci.",
    },
    {
        title: "Boards",
        description: "Quae sit sunt excepturi fugit veniam voluptatem ipsum commodi.",
    },
    {
        title: "Reporting",
        description: "Eos laudantium repellat sed architecto earum unde incidunt.",
    },
    {
        title: "Mobile app",
        description: "Nulla est saepe accusamus nostrum est est fugit omnis.",
    },
];

const FeaturesList = () => {
    return (
        <section className="py-24">
            <div className="grid grid-cols-1 gap-x-20 gap-y-16 lg:grid-cols-3">
                {/* Header Column */}
                <div className="flex flex-col gap-6">
                    <p className="text-sm font-medium text-blue-600">Features List</p>
                    <h2 className="text-4xl font-medium tracking-tight md:text-5xl">
                        Lorem ipsum dolor sit amet.
                    </h2>
                    <p className="text-lg text-gray-600">
                        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores
                        impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis
                        ratione.
                    </p>
                </div>

                {/* Features Columns */}
                <div className="lg:col-span-2">
                    <div className="grid grid-cols-1 gap-12 sm:grid-cols-2">
                        {features.map((feature) => (
                            <div key={feature.title} className="flex gap-3">
                                <div className="flex-shrink-0">
                                    <Check className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-lg font-medium">{feature.title}</h3>
                                    <p className="text-base text-gray-600">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturesList;
