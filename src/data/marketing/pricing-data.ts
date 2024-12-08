const _handlePlanSelection = (stripePriceId: string) => {
    const signUpUrl = `/auth/sign-up?stripe_price_id=${stripePriceId}`;
    window.location.href = signUpUrl;
};

export const defaultPricingPlans = {
    monthly: [
        {
            name: "Free",
            price: "$0",
            period: "/month",
            buttonVariant: "secondary",
            onClick: () => _handlePlanSelection("price_free"),
            stripePriceId: "price_free",
        },
        {
            name: "Pro",
            price: "$49",
            period: "/month",
            buttonVariant: "primary",
            onClick: () => _handlePlanSelection("price_def456"),
            stripePriceId: "price_def456",
        },
        {
            name: "Enterprise",
            price: "$99",
            period: "/month",
            buttonVariant: "secondary",
            onClick: () => _handlePlanSelection("price_ghi789"),
            stripePriceId: "price_ghi789",
        },
    ],
    annual: [
        {
            name: "Free",
            price: "$0",
            period: "/year",
            buttonVariant: "secondary",
            onClick: () => _handlePlanSelection("price_free"),
            stripePriceId: "price_free",
        },
        {
            name: "Pro",
            price: "$490",
            period: "/year",
            buttonVariant: "primary",
            onClick: () => _handlePlanSelection("price_mno345"),
            stripePriceId: "price_mno345",
        },
        {
            name: "Enterprise",
            price: "$990",
            period: "/year",
            buttonVariant: "secondary",
            onClick: () => _handlePlanSelection("price_pqr678"),
            stripePriceId: "price_pqr678",
        },
    ],
};

export const pricingCardFeatures = [
    {
        category: "Lorem Features",
        items: [
            {
                name: "Duis aute irure dolor",
                free: true,
                pro: true,
                enterprise: true,
            },
            {
                name: "Excepteur sint occaecat",
                free: false,
                pro: true,
                enterprise: true,
            },
            {
                name: "Cupidatat non proident",
                free: false,
                pro: true,
                enterprise: true,
            },
            {
                name: "Sunt in culpa qui",
                free: false,
                pro: false,
                enterprise: true,
            },
            {
                name: "Deserunt mollit anim",
                free: false,
                pro: false,
                enterprise: true,
            },
        ],
    },
    {
        category: "Ipsum Limits",
        items: [
            {
                name: "Consectetur Quota",
                free: "5",
                pro: "50",
                enterprise: "Unlimited",
            },
            {
                name: "Adipiscing Slots",
                free: "2",
                pro: "10",
                enterprise: "25",
            },
        ],
    },
];

export const defaultPricingFeatures = [
    {
        category: "Lorem",
        items: [
            {
                name: "Lorem ipsum dolor sit amet",
                free: true,
                pro: true,
                enterprise: true,
            },
            {
                name: "Consectetur adipiscing elit",
                free: false,
                pro: true,
                enterprise: true,
            },
            {
                name: "Sed do eiusmod tempor",
                free: false,
                pro: true,
                enterprise: true,
            },
            {
                name: "Ut labore et dolore",
                free: false,
                pro: true,
                enterprise: true,
            },
            {
                name: "Magna aliqua ut enim",
                free: false,
                pro: false,
                enterprise: true,
            },
        ],
    },
    {
        category: "Ipsum",
        items: [
            {
                name: "Minim veniam",
                free: "1 GB",
                pro: "50 GB",
                enterprise: "500 GB",
            },
            {
                name: "Quis nostrud exercitation",
                free: "10 GB",
                pro: "500 GB",
                enterprise: "Unlimited",
            },
            {
                name: "Ullamco laboris",
                free: "1",
                pro: "5",
                enterprise: "Unlimited",
            },
        ],
    },
];
