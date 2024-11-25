import { Check } from "lucide-react";

const plans = [
    {
        name: "Starter",
        price: "$19",
        period: "/month",
        buttonVariant: "secondary",
    },
    {
        name: "Growth",
        price: "$49",
        period: "/month",
        buttonVariant: "primary",
    },
    {
        name: "Scale",
        price: "$99",
        period: "/month",
        buttonVariant: "secondary",
    },
];

const features = [
    {
        category: "Features",
        items: [
            {
                name: "Edge content delivery",
                starter: true,
                growth: true,
                scale: true,
            },
            {
                name: "Custom domains",
                starter: "1",
                growth: "3",
                scale: "Unlimited",
            },
            {
                name: "Team members",
                starter: "3",
                growth: "20",
                scale: "Unlimited",
            },
            {
                name: "Single sign-on (SSO)",
                starter: false,
                growth: false,
                scale: true,
            },
        ],
    },
    {
        category: "Reporting",
        items: [
            {
                name: "Advanced analytics",
                starter: true,
                growth: true,
                scale: true,
            },
            {
                name: "Basic reports",
                starter: false,
                growth: true,
                scale: true,
            },
            {
                name: "Professional reports",
                starter: false,
                growth: false,
                scale: true,
            },
            {
                name: "Custom report builder",
                starter: false,
                growth: false,
                scale: true,
            },
        ],
    },
    {
        category: "Support",
        items: [
            {
                name: "24/7 online support",
                starter: true,
                growth: true,
                scale: true,
            },
            {
                name: "Quarterly workshops",
                starter: false,
                growth: true,
                scale: true,
            },
            {
                name: "Priority phone support",
                starter: false,
                growth: false,
                scale: true,
            },
            {
                name: "1:1 onboarding tour",
                starter: false,
                growth: false,
                scale: true,
            },
        ],
    },
];

const PricingComparison = () => {
    return (
        <section className="py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-16">
                {/* Header Section */}
                <div className="text-start flex flex-col gap-6">
                    <p className="text-sm font-medium text-blue-600">Pricing</p>
                    <h2 className="text-4xl font-medium tracking-tight md:text-5xl">
                        Lorem ipsum dolor sit amet.
                    </h2>
                    <p className="max-w-4xl text-lg text-gray-600">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci optio nisi
                        illum animi similique? Minus pariatur tempore aspernatur minima rerum!
                    </p>
                </div>

                {/* Plan Headers */}
                <div className="grid grid-cols-4 gap-8">
                    <div className="col-span-1" />
                    {plans.map((plan) => (
                        <div key={plan.name} className="col-span-1 text-center flex flex-col gap-6">
                            <h3 className="text-lg font-medium">{plan.name}</h3>
                            <div>
                                <span className="text-4xl font-medium">{plan.price}</span>
                                <span className="text-sm text-gray-500">{plan.period}</span>
                            </div>
                            <button
                                className={`w-full rounded-md px-6 py-2.5 text-sm transition-colors ${
                                    plan.buttonVariant === "primary"
                                        ? "bg-black text-white hover:bg-gray-800"
                                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                                }`}
                            >
                                Buy plan
                            </button>
                        </div>
                    ))}
                </div>

                {/* Feature Comparison */}
                <div className="flex flex-col gap-12">
                    {features.map((section) => (
                        <div key={section.category} className="flex flex-col gap-4">
                            <h4 className="text-base font-medium">{section.category}</h4>
                            <div className="divide-y divide-gray-200">
                                {section.items.map((item) => (
                                    <div key={item.name} className="grid grid-cols-4 gap-8 py-6">
                                        <div className="col-span-1 text-sm text-gray-600">
                                            {item.name}
                                        </div>
                                        {/* Starter */}
                                        <div className="col-span-1 text-center">
                                            {typeof item.starter === "boolean" ? (
                                                item.starter ? (
                                                    <Check className="mx-auto h-5 w-5 text-black" />
                                                ) : (
                                                    <span className="text-sm text-gray-400">—</span>
                                                )
                                            ) : (
                                                <span className="text-sm">{item.starter}</span>
                                            )}
                                        </div>
                                        {/* Growth */}
                                        <div className="col-span-1 text-center">
                                            {typeof item.growth === "boolean" ? (
                                                item.growth ? (
                                                    <Check className="mx-auto h-5 w-5 text-black" />
                                                ) : (
                                                    <span className="text-sm text-gray-400">—</span>
                                                )
                                            ) : (
                                                <span className="text-sm">{item.growth}</span>
                                            )}
                                        </div>
                                        {/* Scale */}
                                        <div className="col-span-1 text-center">
                                            {typeof item.scale === "boolean" ? (
                                                item.scale ? (
                                                    <Check className="mx-auto h-5 w-5 text-black" />
                                                ) : (
                                                    <span className="text-sm text-gray-400">—</span>
                                                )
                                            ) : (
                                                <span className="text-sm">{item.scale}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PricingComparison;
