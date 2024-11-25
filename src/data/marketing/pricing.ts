export const defaultPricingPlans = [
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

export const defaultPricingFeatures = [
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
                name: "Unlimited projects",
                starter: false,
                growth: true,
                scale: true,
            },
            {
                name: "API access",
                starter: false,
                growth: true,
                scale: true,
            },
            {
                name: "Custom domain",
                starter: false,
                growth: true,
                scale: true,
            },
            {
                name: "Priority support",
                starter: false,
                growth: false,
                scale: true,
            },
        ],
    },
    {
        category: "Usage",
        items: [
            {
                name: "Storage",
                starter: "10 GB",
                growth: "50 GB",
                scale: "500 GB",
            },
            {
                name: "Monthly bandwidth",
                starter: "100 GB",
                growth: "500 GB",
                scale: "Unlimited",
            },
            {
                name: "Team members",
                starter: "1",
                growth: "5",
                scale: "Unlimited",
            },
        ],
    },
];
